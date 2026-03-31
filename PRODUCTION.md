
## Full Docker Setup ()

```bash
# Start all services
docker compose up -d

# Setup database
docker compose exec backend npx sequelize-cli db:migrate
docker compose exec backend npx sequelize-cli db:seed:all
```
