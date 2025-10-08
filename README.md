# Golive Management System

Chạy toàn bộ hệ thống bằng docker-compose.

## Yêu cầu
- Docker, Docker Compose

## Chạy
```bash
docker-compose up --build
```

- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- Frontend: http://localhost:4200
- Postgres: localhost:5432 (db golive / user golive_user / pass golive_pass)

## Ghi chú
- Flyway khởi tạo schema với 1 file duy nhất: `V1__init_schema.sql` (đã dùng BIGSERIAL/BIGINT đúng chuẩn).
- API chính:
  - POST `/api/changes`
  - PUT `/api/changes/{id}`
  - PUT `/api/changes/{id}/status`
  - POST `/api/changes/{id}/rollback`
  - POST `/api/changes/{id}/rollback-components`
  - GET `/api/timeline?date=YYYY-MM-DD`
  - GET `/api/components`
