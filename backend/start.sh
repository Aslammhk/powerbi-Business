#!/bin/bash
# Start script for Railway
# Uses PORT env variable if available, defaults to 8000

PORT=""
echo "Starting server on port "

exec uvicorn app.main:app \
    --host 0.0.0.0 \
    --port "" \
    --workers 1 \
    --log-level info
