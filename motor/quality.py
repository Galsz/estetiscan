"""Análise de qualidade de imagem e correção automática."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

import cv2
import numpy as np

from motor import config


# ---------------------------------------------------------------------------
# Estrutura de métricas
# ---------------------------------------------------------------------------

@dataclass
class QualityMetrics:
    """Métricas de qualidade extraídas de uma imagem em escala de cinza."""

    mean: float = 0.0
    std: float = 0.0
    p1: float = 0.0    # percentil 1
    p5: float = 0.0    # percentil 5
    p25: float = 0.0   # percentil 25 (Q1)
    p50: float = 0.0   # mediana
    p75: float = 0.0   # percentil 75 (Q3)
    p95: float = 0.0   # percentil 95
    p99: float = 0.0   # percentil 99
    clipped_black_ratio: float = 0.0
    clipped_white_ratio: float = 0.0
    laplacian_var: float = 0.0
    issues: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {k: v for k, v in self.__dict__.items()}


# ---------------------------------------------------------------------------
# Cálculo de métricas
# ---------------------------------------------------------------------------

def compute_metrics(gray: np.ndarray) -> QualityMetrics:
    """Calcula métricas de qualidade a partir de uma imagem em escala de cinza.

    Retorna um ``QualityMetrics`` preenchido, incluindo a lista ``issues``
    com os problemas detectados.
    """
    total_pixels = gray.size
    m = QualityMetrics(
        mean=float(np.mean(gray)),
        std=float(np.std(gray)),
        p1=float(np.percentile(gray, 1)),
        p5=float(np.percentile(gray, 5)),
        p25=float(np.percentile(gray, 25)),
        p50=float(np.percentile(gray, 50)),
        p75=float(np.percentile(gray, 75)),
        p95=float(np.percentile(gray, 95)),
        p99=float(np.percentile(gray, 99)),
        clipped_black_ratio=float(np.sum(gray <= 10) / total_pixels),
        clipped_white_ratio=float(np.sum(gray >= 245) / total_pixels),
        laplacian_var=float(cv2.Laplacian(gray, cv2.CV_64F).var()),
    )

    # Detecção de problemas
    if m.mean < config.MEAN_TOO_DARK:
        m.issues.append("muito_escura")
    if m.mean > config.MEAN_TOO_BRIGHT:
        m.issues.append("muito_clara")
    if m.std < config.STD_LOW_CONTRAST:
        m.issues.append("baixo_contraste")
    if m.clipped_black_ratio > config.CLIPPED_BLACK_THRESHOLD:
        m.issues.append("estouro_preto")
    if m.clipped_white_ratio > config.CLIPPED_WHITE_THRESHOLD:
        m.issues.append("estouro_branco")
    if m.laplacian_var < config.LAPLACIAN_BLUR_THRESHOLD:
        m.issues.append("baixa_nitidez")

    return m


# ---------------------------------------------------------------------------
# Decisão: a imagem precisa de correção?
# ---------------------------------------------------------------------------

def needs_correction(metrics: QualityMetrics) -> bool:
    """Retorna ``True`` se a imagem apresenta problemas corrigíveis."""
    correctable = {"muito_escura", "muito_clara", "baixo_contraste"}
    return bool(correctable & set(metrics.issues))


# ---------------------------------------------------------------------------
# Correção automática via CLAHE no canal L (luminância)
# ---------------------------------------------------------------------------

def apply_clahe(bgr: np.ndarray) -> np.ndarray:
    """Aplica CLAHE no canal de luminância (L) em espaço LAB.

    Retorna a imagem BGR corrigida.
    """
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    l_channel, a, b = cv2.split(lab)

    clahe = cv2.createCLAHE(
        clipLimit=config.CLAHE_CLIP_LIMIT,
        tileGridSize=config.CLAHE_TILE_SIZE,
    )
    l_corrected = clahe.apply(l_channel)

    lab_corrected = cv2.merge([l_corrected, a, b])
    return cv2.cvtColor(lab_corrected, cv2.COLOR_LAB2BGR)


# ---------------------------------------------------------------------------
# Validação de ganho real
# ---------------------------------------------------------------------------

def validate_correction(
    original_metrics: QualityMetrics,
    corrected_gray: np.ndarray,
) -> tuple[bool, QualityMetrics]:
    """Verifica se a correção produziu ganho real.

    Returns:
        Uma tupla ``(ganho_valido, metricas_corrigidas)``.
    """
    corrected_metrics = compute_metrics(corrected_gray)

    std_gain = corrected_metrics.std - original_metrics.std
    mean_shift = abs(corrected_metrics.mean - original_metrics.mean)

    # Correção válida: ganho de contraste sem deslocar demais a média
    gain_ok = std_gain >= config.MIN_STD_GAIN and mean_shift <= config.MAX_MEAN_SHIFT

    # Se a imagem original já tinha contraste razoável e a correção não
    # melhorou significativamente, desconsiderar
    if not gain_ok:
        # Mesmo sem grande ganho de std, verificar se problemas foram resolvidos
        still_dark = corrected_metrics.mean < config.MEAN_TOO_DARK
        still_bright = corrected_metrics.mean > config.MEAN_TOO_BRIGHT
        still_low_contrast = corrected_metrics.std < config.STD_LOW_CONTRAST
        if not still_dark and not still_bright and not still_low_contrast:
            # Problemas básicos resolvidos mesmo sem grande salto de std
            if original_metrics.issues:
                gain_ok = True

    return gain_ok, corrected_metrics
