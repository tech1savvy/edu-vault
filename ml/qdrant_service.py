import uuid
import httpx
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    PointStruct,
    VectorParams,
)
from config import QDRANT_URL, QDRANT_COLLECTION
from logger import logger

_client = None

VECTOR_SIZE = 384


def _string_to_uuid(s: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, s))


def get_client() -> QdrantClient:
    global _client
    if _client is None:
        logger.info(f"Connecting to Qdrant at {QDRANT_URL}")
        _client = QdrantClient(url=QDRANT_URL, prefer_grpc=False)
        _ensure_collection()
        logger.info("Qdrant connection established")
    return _client


def _ensure_collection():
    collections = _client.get_collections().collections
    collection_names = [c.name for c in collections]
    if QDRANT_COLLECTION not in collection_names:
        _client.create_collection(
            collection_name=QDRANT_COLLECTION,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )
        logger.info(f"Created collection: {QDRANT_COLLECTION}")


def upsert_vector(vector_id: str, embedding: list[float], metadata: dict):
    client = get_client()
    payload = {**metadata, "external_id": vector_id}
    client.upsert(
        collection_name=QDRANT_COLLECTION,
        points=[
            PointStruct(
                id=_string_to_uuid(vector_id),
                vector=embedding,
                payload=payload,
            )
        ],
    )
    logger.debug(f"Upserted vector: {vector_id}")


def query_similar(
    embedding: list[float],
    limit: int = 10,
    filter_type: str | None = None,
) -> list[dict]:
    with httpx.Client(base_url=QDRANT_URL, timeout=30.0) as client:
        payload = {
            "vector": embedding,
            "limit": limit,
            "with_payload": True,
        }
        if filter_type:
            payload["filter"] = {
                "must": [{"key": "type", "match": {"value": filter_type}}]
            }

        response = client.post(
            f"/collections/{QDRANT_COLLECTION}/points/search",
            json=payload,
        )
        response.raise_for_status()
        result = response.json()

        points = result.get("result", [])
        return [
            {
                "vector_id": str(point["id"]),
                "score": point["score"],
                **point.get("payload", {}),
            }
            for point in points
        ]


def get_vector(vector_id: str) -> dict | None:
    with httpx.Client(base_url=QDRANT_URL, timeout=30.0) as client:
        payload = {
            "filter": {"must": [{"key": "external_id", "match": {"value": vector_id}}]},
            "limit": 1,
            "with_vectors": True,
            "with_payload": True,
        }

        response = client.post(
            f"/collections/{QDRANT_COLLECTION}/points/scroll",
            json=payload,
        )
        response.raise_for_status()
        result = response.json()

        points = result.get("result", {}).get("points", [])
        if not points:
            logger.debug(f"Vector not found: {vector_id}")
            return None

        point = points[0]
        return {
            "vector_id": str(point["id"]),
            "vector": point.get("vector"),
            **point.get("payload", {}),
        }
