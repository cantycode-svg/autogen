# Use python base image with Node.js for frontend build
FROM node:18-slim as frontend-builder

# Install yarn
RUN npm install -g yarn

# Set working directory for frontend
WORKDIR /frontend

# Copy frontend package files
COPY python/packages/autogen-studio/frontend/package*.json ./
COPY python/packages/autogen-studio/frontend/yarn.lock ./

# Install frontend dependencies
RUN yarn install

# Copy frontend source code
COPY python/packages/autogen-studio/frontend/ ./

# Build frontend
RUN yarn build

# Main Python image
FROM python:3.10-slim

WORKDIR /code
RUN pip install -U gunicorn autogenstudio

# Create a non-root user
RUN useradd -m -u 1000 user
USER user

ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    AUTOGENSTUDIO_APPDIR=/home/user/app
ENV PYTHONUNBUFFERED=1
ENV MALLOC_ARENA_MAX=2

WORKDIR $HOME/app

# Copy application code
COPY --chown=user . $HOME/app

# Copy built frontend assets to the correct location for FastAPI static serving
# AutoGen Studio typically serves static files from autogenstudio/web/ui/
COPY --from=frontend-builder --chown=user /frontend/build/ $HOME/app/python/packages/autogen-studio/autogenstudio/web/ui/

CMD gunicorn -w 1 --timeout 12600 -k uvicorn.workers.UvicornWorker autogenstudio.web.app:app --bind "0.0.0.0:8081"
