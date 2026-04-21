import os
import time
from fastapi import FastAPI
from pydantic import BaseModel
from prometheus_client import make_asgi_app, Counter, Histogram
from embedding_service import generate_embedding
from qdrant_service import upsert_vector, query_similar, get_vector
from logger import logger

app = FastAPI(title="ML Service", description="Embedding and matching service")

# ==============================================================================
# Prometheus Metrics Setup
# ==============================================================================

# Create metrics for HTTP requests
http_requests_total = Counter(
    "http_requests_total", "Total HTTP requests", ["method", "status", "endpoint"]
)

http_request_duration = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration",
    ["method", "status", "endpoint"],
    buckets=(0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0),
)

# Embedding generation metrics
embedding_duration = Histogram(
    "embedding_duration_seconds",
    "Time to generate embeddings",
    buckets=(0.1, 0.5, 1.0, 2.0, 5.0, 10.0),
)

# Expose /metrics endpoint for Prometheus scraping
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# ==============================================================================
# Metrics Middleware
# Track request counts and durations
# ==============================================================================


@app.middleware("http")
async def track_metrics(request, call_next):
    method = request.method
    endpoint = request.url.path

    if endpoint == "/metrics":
        return await call_next(request)

    start_time = time.perf_counter()

    response = await call_next(request)

    duration = time.perf_counter() - start_time

    http_requests_total.labels(
        method=method, status=str(response.status_code), endpoint=endpoint
    ).inc()

    http_request_duration.labels(
        method=method, status=str(response.status_code), endpoint=endpoint
    ).observe(duration)

    return response


PORT = int(os.getenv("ML_SERVICE_PORT", "8001"))


class EmbedRequest(BaseModel):
    text: str


class SyncResumeRequest(BaseModel):
    user_id: int
    text: str


class SyncJobRequest(BaseModel):
    job_id: int
    text: str


class BatchSyncResume(BaseModel):
    id: int
    text: str


class BatchSyncJob(BaseModel):
    id: int
    text: str


class BatchSyncRequest(BaseModel):
    resumes: list[BatchSyncResume]
    jobs: list[BatchSyncJob]


class MatchRequest(BaseModel):
    job_id: int
    text: str
    limit: int = 10


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/embed")
def embed_text(request: EmbedRequest):
    start_time = time.perf_counter()

    embedding = generate_embedding(request.text)

    embedding_duration.observe(time.perf_counter() - start_time)

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


@app.post("/sync/batch")
def sync_batch(request: BatchSyncRequest):
    logger.info(
        f"Starting batch sync: {len(request.resumes)} resumes, {len(request.jobs)} jobs"
    )

    synced_resumes = 0
    failed_resumes = []

    for resume in request.resumes:
        try:
            embedding = generate_embedding(resume.text)
            upsert_vector(
                vector_id=f"user-{resume.id}",
                embedding=embedding,
                metadata={"type": "resume", "user_id": resume.id},
            )
            synced_resumes += 1
            logger.debug(f"Synced resume for user {resume.id}")
        except Exception as e:
            logger.error(f"Failed to sync user {resume.id}: {e}")
            failed_resumes.append({"id": resume.id, "error": str(e)})

    synced_jobs = 0
    failed_jobs = []

    for job in request.jobs:
        try:
            embedding = generate_embedding(job.text)
            upsert_vector(
                vector_id=f"job-{job.id}",
                embedding=embedding,
                metadata={"type": "job", "job_id": job.id},
            )
            synced_jobs += 1
            logger.debug(f"Synced job {job.id}")
        except Exception as e:
            logger.error(f"Failed to sync job {job.id}: {e}")
            failed_jobs.append({"id": job.id, "error": str(e)})

    return {
        "status": "ok",
        "synced_resumes": synced_resumes,
        "failed_resumes": failed_resumes,
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
