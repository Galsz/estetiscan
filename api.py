"""Servidor API mínimo para o EstetiScan AI.

Expõe o motor de processamento via HTTP para consumo pela landing page
ou qualquer cliente web.

Uso:
    python api.py
    # ou
    uvicorn api:app --reload --port 8000
"""

from __future__ import annotations

import os

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from motor.service import process_upload

app = FastAPI(
    title="EstetiScan AI API",
    description="API de triagem e processamento de imagens clínicas.",
    version="0.1.0",
)


def _get_allowed_origins() -> list[str]:
    configured = os.getenv("CORS_ORIGINS", "").strip()
    default_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
    if not configured:
        return default_origins
    return [origin.strip() for origin in configured.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_allowed_origins(),
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.post("/api/process")
async def process_image_endpoint(file: UploadFile = File(...)):
    """Recebe uma imagem e retorna o payload completo do pipeline."""
    contents = await file.read()
    filename = file.filename or "upload.png"
    result = process_upload(contents, filename)
    return result


@app.get("/api/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
