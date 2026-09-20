FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if any needed (e.g. for opencv or sqlite)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create volume for sqlite database to persist
VOLUME ["/app/data"]

COPY . .

# Ensure db path points to volume
ENV DB_PATH=/app/data/observe.db

EXPOSE 8000

CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]
