FROM python:3.13-slim

WORKDIR /app

COPY pyproject.toml ./

RUN pip install --no-cache-dir \
    fastembed>=0.7.0 \
    fastapi>=0.100.0 \
    uvicorn>=0.23.0 \
    qdrant-client>=1.9.0 \
    httpx>=0.25.0 \
    python-dotenv>=1.0.0 \
    psycopg2-binary>=2.9.0

COPY . .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
