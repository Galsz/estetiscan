"""Segmentação de imagem: Otsu, separabilidade e geração de artefatos."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import cv2
import numpy as np

from motor import config


# ---------------------------------------------------------------------------
# Estrutura de resultado de segmentação
# ---------------------------------------------------------------------------

@dataclass
class SegmentationResult:
    """Resultado da tentativa de segmentação."""

    viable: bool
    separability: float
    otsu_threshold: int
    binary: Optional[np.ndarray] = None
    segmented_color: Optional[np.ndarray] = None
    segmented_crop: Optional[np.ndarray] = None


# ---------------------------------------------------------------------------
# Separabilidade inter-classe (critério de Otsu)
# ---------------------------------------------------------------------------

def compute_separability(gray: np.ndarray) -> tuple[float, int]:
    """Calcula a separabilidade inter-classe normalizada e o limiar de Otsu.

    A separabilidade é a razão entre a variância inter-classe e a variância
    total da imagem.  Valores próximos de 1 indicam boa separação entre
    fundo e região de interesse.

    Returns:
        ``(separabilidade, limiar_otsu)``
    """
    threshold, _ = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    threshold = int(threshold)

    total_var = float(np.var(gray))
    if total_var == 0:
        return 0.0, threshold

    # Variância inter-classe
    mask_fg = gray > threshold
    mask_bg = ~mask_fg

    n_total = gray.size
    w_fg = float(np.sum(mask_fg)) / n_total
    w_bg = 1.0 - w_fg

    if w_fg == 0 or w_bg == 0:
        return 0.0, threshold

    mean_fg = float(np.mean(gray[mask_fg]))
    mean_bg = float(np.mean(gray[mask_bg]))

    inter_class_var = w_fg * w_bg * (mean_fg - mean_bg) ** 2
    separability = inter_class_var / total_var

    return separability, threshold


# ---------------------------------------------------------------------------
# Verificação de viabilidade
# ---------------------------------------------------------------------------

def check_viability(gray: np.ndarray) -> tuple[bool, float, int]:
    """Verifica se a segmentação automática é viável.

    Returns:
        ``(viavel, separabilidade, limiar_otsu)``
    """
    sep, thresh = compute_separability(gray)
    viable = sep >= config.OTSU_SEPARABILITY_THRESHOLD
    return viable, sep, thresh


# ---------------------------------------------------------------------------
# Geração dos artefatos de segmentação
# ---------------------------------------------------------------------------

def segment(
    gray: np.ndarray,
    bgr: Optional[np.ndarray] = None,
    threshold: Optional[int] = None,
) -> SegmentationResult:
    """Executa a segmentação completa e retorna os artefatos.

    Se ``threshold`` não for informado, o valor de Otsu será calculado.
    """
    viable, sep, otsu_thresh = check_viability(gray)
    if threshold is None:
        threshold = otsu_thresh

    if not viable:
        return SegmentationResult(
            viable=False,
            separability=sep,
            otsu_threshold=otsu_thresh,
        )

    # Binarização
    _, binary = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)

    seg_color: Optional[np.ndarray] = None
    seg_crop: Optional[np.ndarray] = None

    if bgr is not None:
        # Aplicar máscara sobre a imagem colorida
        mask_3ch = cv2.merge([binary, binary, binary])
        seg_color = cv2.bitwise_and(bgr, mask_3ch)

        # Recorte pela bounding box da região segmentada
        coords = cv2.findNonZero(binary)
        if coords is not None:
            x, y, w, h = cv2.boundingRect(coords)
            seg_crop = bgr[y : y + h, x : x + w].copy()

    return SegmentationResult(
        viable=True,
        separability=sep,
        otsu_threshold=otsu_thresh,
        binary=binary,
        segmented_color=seg_color,
        segmented_crop=seg_crop,
    )
