"""Camada de serviço para consumo por interfaces web.

Recebe bytes de uma imagem, processa pelo pipeline e devolve um payload
estruturado com status, métricas, mensagem amigável e artefatos codificados
em base64 — pronto para uso direto em APIs JSON.
"""

from __future__ import annotations

import base64
import tempfile
from pathlib import Path
from typing import Any, Optional

import cv2
import numpy as np

from motor.pipeline import process_image

# ---------------------------------------------------------------------------
# Mensagens amigáveis por status
# ---------------------------------------------------------------------------

_MESSAGES: dict[str, str] = {
    "ideal": "A imagem está em excelentes condições — iluminação, contraste e separabilidade adequados.",
    "adequada": "A imagem apresenta qualidade suficiente para uso, sem necessidade de correção.",
    "corrigida_automaticamente": "A imagem apresentava problemas técnicos leves e foi corrigida automaticamente com sucesso.",
    "ajuste_sem_ganho_relevante": "O sistema tentou corrigir a imagem, mas não houve melhora significativa.",
    "requer_revisao_humana": "A imagem é complexa demais para processamento automático confiável e requer revisão humana.",
}

_STATUS_LABELS: dict[str, str] = {
    "ideal": "Ideal",
    "adequada": "Adequada",
    "corrigida_automaticamente": "Corrigida automaticamente",
    "ajuste_sem_ganho_relevante": "Ajuste sem ganho relevante",
    "requer_revisao_humana": "Requer revisão humana",
}


def _encode_image(path: Optional[str]) -> Optional[str]:
    """Lê um arquivo de imagem e retorna como data-URI base64."""
    if path is None:
        return None
    p = Path(path)
    if not p.is_file():
        return None
    data = p.read_bytes()
    ext = p.suffix.lower()
    mime = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".bmp": "image/bmp",
        ".webp": "image/webp",
        ".tif": "image/tiff",
        ".tiff": "image/tiff",
    }.get(ext, "image/png")
    b64 = base64.b64encode(data).decode("ascii")
    return f"data:{mime};base64,{b64}"


def process_upload(
    image_bytes: bytes,
    filename: str,
    output_dir: Optional[str | Path] = None,
) -> dict[str, Any]:
    """Processa uma imagem enviada via upload e retorna payload para UI.

    Args:
        image_bytes: Conteúdo binário da imagem.
        filename: Nome original do arquivo.
        output_dir: Diretório de saída para artefatos. Se ``None`` usa um
            diretório temporário.

    Returns:
        Dicionário com ``status``, ``status_label``, ``message``,
        ``metrics``, ``artifacts`` (data-URIs base64) e metadados.
    """
    if output_dir is None:
        output_dir = Path(tempfile.mkdtemp(prefix="estetiscan_"))
    output_dir = Path(output_dir)

    # Salvar bytes em arquivo temporário para o pipeline
    suffix = Path(filename).suffix or ".png"
    tmp_path = output_dir / f"_upload{suffix}"
    tmp_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path.write_bytes(image_bytes)

    # Processar pelo pipeline existente
    result = process_image(tmp_path, output_dir=output_dir)

    # Remover arquivo temporário de upload
    tmp_path.unlink(missing_ok=True)

    status = result["status_cliente"]
    arts = result.get("artefatos", {})

    # Montar métricas resumidas
    orig = result.get("metricas_originais", {})
    final = result.get("metricas_finais", {})
    metrics = {
        "original": {
            "mean": round(orig.get("mean", 0), 1),
            "std": round(orig.get("std", 0), 1),
            "laplacian_var": round(orig.get("laplacian_var", 0), 1),
        },
        "final": {
            "mean": round(final.get("mean", 0), 1),
            "std": round(final.get("std", 0), 1),
            "laplacian_var": round(final.get("laplacian_var", 0), 1),
        },
        "separability": (
            round(result["separabilidade_otsu"], 4)
            if result.get("separabilidade_otsu") is not None
            else None
        ),
        "otsu_threshold": result.get("limiar_otsu"),
    }

    # Codificar artefatos como data-URI base64
    artifacts = {
        "original": _encode_image(arts.get("orig_color")),
        "grayscale": _encode_image(arts.get("gray")),
        "corrected": _encode_image(arts.get("eq_color")),
        "corrected_gray": _encode_image(arts.get("eq_gray")),
        "binary_mask": _encode_image(arts.get("bin")),
        "segmented": _encode_image(arts.get("seg_color")),
        "cropped": _encode_image(arts.get("seg_crop")),
    }

    validation = result.get("detalhes_validacao", {})

    return {
        "filename": filename,
        "status": status,
        "status_label": _STATUS_LABELS.get(status, status),
        "message": _MESSAGES.get(status, ""),
        "needs_correction": result.get("needs_equalization", False),
        "correction_applied": validation.get("correction_accepted", False),
        "requires_human_review": result.get("requires_human_review", False),
        "metrics": metrics,
        "validation": {
            "attempted": validation.get("correction_attempted", False),
            "accepted": validation.get("correction_accepted", False),
            "std_gain": round(validation.get("std_gain", 0), 2) if validation.get("std_gain") is not None else None,
            "mean_shift": round(validation.get("mean_shift", 0), 2) if validation.get("mean_shift") is not None else None,
        },
        "artifacts": artifacts,
    }
