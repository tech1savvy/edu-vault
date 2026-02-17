# ROADMAP

1.  Node.js:
    - Create a "Service Account" or API Key for the Python service.
    - Expose GET /internal/resumes/:userId (returns aggregated text).
    - Expose POST /internal/matches (accepts an array of { userId, score }).
2.  RabbitMQ:
    - Make RabbitMQ Server
    - Add amqplib to Node.js to send tasks.
3.  Python:
    - Use kombu for RabbitMQ.
    - Use httpx for calling Node.js.
    - Use qdrant-client for vector storage.
