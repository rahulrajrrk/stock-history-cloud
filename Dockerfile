# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend/ ./backend/
COPY frontend/build/ ./frontend/build/

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8080

# Set entry point
CMD ["gunicorn", "--chdir", "backend", "app:app", "--bind", "0.0.0.0:8080"]