import os
from fastapi import FastAPI
from pydantic import BaseModel
from embedding_service import generate_embedding
from qdrant_service import upsert_vector, query_similar, get_vector
from logger import logger
import httpx

app = FastAPI(title="ML Service", description="Embedding and matching service")

PORT = int(os.getenv("ML_SERVICE_PORT", "8001"))
DB_HOST = os.getenv("DB_HOST", "postgres")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "edu_vault")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")


class EmbedRequest(BaseModel):
    text: str


class SyncResumeRequest(BaseModel):
    user_id: int
    text: str


class SyncJobRequest(BaseModel):
    job_id: int
    text: str


class MatchRequest(BaseModel):
    job_id: int
    text: str
    limit: int = 10


def get_db_connection():
    import psycopg2

    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )


def get_all_users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id FROM "Users" WHERE role = %s', ("student",))
    users = cur.fetchall()
    cur.close()
    conn.close()
    return [u[0] for u in users]


def get_all_job_descriptions():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id FROM "JobDescriptions"')
    jobs = cur.fetchall()
    cur.close()
    conn.close()
    return [j[0] for j in jobs]


def get_resume_text(user_id):
    conn = get_db_connection()
    cur = conn.cursor()

    parts = []

    cur.execute(
        'SELECT name, role, email, phone, location, link FROM "Headings" WHERE user_id = %s',
        (user_id,),
    )
    heading = cur.fetchone()
    if heading:
        parts.extend([h for h in heading if h])

    cur.execute('SELECT name, level FROM "Skills" WHERE user_id = %s', (user_id,))
    skills = cur.fetchall()
    if skills:
        parts.append(", ".join([f"{s[0]} ({s[1]})" for s in skills]))

    cur.execute(
        'SELECT institution, degree, "fieldOfStudy", duration FROM "Educations" WHERE user_id = %s',
        (user_id,),
    )
    education = cur.fetchall()
    if education:
        parts.extend([f"{e[0]} - {e[1]} in {e[2]}" for e in education if e[0]])

    cur.execute(
        'SELECT company, role, duration, details FROM "Experiences" WHERE user_id = %s',
        (user_id,),
    )
    experience = cur.fetchall()
    if experience:
        parts.extend([f"{e[0]} - {e[1]}: {e[3]}" for e in experience if e[0]])

    cur.execute(
        'SELECT title, description FROM "Projects" WHERE user_id = %s', (user_id,)
    )
    projects = cur.fetchall()
    if projects:
        parts.extend([f"{p[0]}: {p[1]}" for p in projects if p[0]])

    cur.close()
    conn.close()
    return "\n".join(parts) if parts else None


def get_job_text(job_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'SELECT title, description, requirements FROM "JobDescriptions" WHERE id = %s',
        (job_id,),
    )
    job = cur.fetchone()
    cur.close()
    conn.close()
    if job:
        return f"{job[0]}\n{job[1]}\n{job[2]}"
    return None


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/embed")
def embed_text(request: EmbedRequest):
    embedding = generate_embedding(request.text)
    return {"embedding": embedding}


@app.post("/sync/resume")
def sync_resume(request: SyncResumeRequest):
    logger.info(f"Syncing resume for user {request.user_id}")
    embedding = generate_embedding(request.text)
    upsert_vector(
        vector_id=f"user-{request.user_id}",
        embedding=embedding,
        metadata={"type": "resume", "user_id": request.user_id},
    )
    return {"status": "ok", "user_id": request.user_id}


@app.post("/sync/job")
def sync_job(request: SyncJobRequest):
    logger.info(f"Syncing job {request.job_id}")
    embedding = generate_embedding(request.text)
    upsert_vector(
        vector_id=f"job-{request.job_id}",
        embedding=embedding,
        metadata={"type": "job", "job_id": request.job_id},
    )
    return {"status": "ok", "job_id": request.job_id}


@app.post("/sync/all")
def sync_all():
    logger.info("Starting full sync of all resumes and job descriptions")

    synced_users = 0
    failed_users = []

    user_ids = get_all_users()
    for user_id in user_ids:
        try:
            resume_text = get_resume_text(user_id)
            if resume_text:
                embedding = generate_embedding(resume_text)
                upsert_vector(
                    vector_id=f"user-{user_id}",
                    embedding=embedding,
                    metadata={"type": "resume", "user_id": user_id},
                )
                synced_users += 1
                logger.debug(f"Synced resume for user {user_id}")
        except Exception as e:
            logger.error(f"Failed to sync user {user_id}: {e}")
            failed_users.append(user_id)

    synced_jobs = 0
    failed_jobs = []

    job_ids = get_all_job_descriptions()
    for job_id in job_ids:
        try:
            job_text = get_job_text(job_id)
            if job_text:
                embedding = generate_embedding(job_text)
                upsert_vector(
                    vector_id=f"job-{job_id}",
                    embedding=embedding,
                    metadata={"type": "job", "job_id": job_id},
                )
                synced_jobs += 1
                logger.debug(f"Synced job {job_id}")
        except Exception as e:
            logger.error(f"Failed to sync job {job_id}: {e}")
            failed_jobs.append(job_id)

    return {
        "status": "ok",
        "message": f"Synced {synced_users} resumes and {synced_jobs} job descriptions",
        "synced_users": synced_users,
        "failed_users": failed_users,
        "synced_jobs": synced_jobs,
        "failed_jobs": failed_jobs,
    }


@app.post("/match")
def match(request: MatchRequest):
    logger.info(f"Finding matches for job {request.job_id}")

    job_vector = get_vector(f"job-{request.job_id}")
    if job_vector:
        embedding = job_vector["vector"]
    else:
        embedding = generate_embedding(request.text)

    matches = query_similar(
        embedding=embedding, limit=request.limit, filter_type="resume"
    )

    return {
        "job_id": request.job_id,
        "matches": matches,
    }


if __name__ == "__main__":
    import uvicorn

    logger.info(f"Starting ML service on port {PORT}")
    uvicorn.run(app, host="0.0.0.0", port=PORT)
