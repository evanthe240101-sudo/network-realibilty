# --- Stage 1: Use lightweight Python image ---
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy project files into container
COPY network_reliability_checker.py /app/

# (Optional) set non-root user for security
# RUN useradd -m appuser && chown -R appuser /app
# USER appuser

# Default command
CMD ["python", "network_reliability_checker.py"]
