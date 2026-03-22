from fastembed import TextEmbedding
from typing import List
import numpy as np
from config import EMBEDDING_MODEL
from logger import logger

_embedding_model = None


def get_model() -> TextEmbedding:
    global _embedding_model
    if _embedding_model is None:
        logger.info(f"Loading embedding model: {EMBEDDING_MODEL}")
        _embedding_model = TextEmbedding(model_name=EMBEDDING_MODEL)
        logger.info("Embedding model loaded successfully")
    return _embedding_model


def generate_embedding(text: str) -> List[float]:
    model = get_model()
    embedding = model.embed([text])
    arr = next(iter(embedding))
    return arr.tolist() if isinstance(arr, np.ndarray) else list(arr)


def generate_embeddings_batch(texts: List[str]) -> List[List[float]]:
    model = get_model()
    embeddings = model.embed(texts)
    return [
        arr.tolist() if isinstance(arr, np.ndarray) else list(arr) for arr in embeddings
    ]
