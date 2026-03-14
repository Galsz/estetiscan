"""Fachada amigável em PT-BR para o motor de processamento.

Expõe funções com nomes em português para uso direto em notebooks e
demonstrações, delegando ao pipeline interno.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

import numpy as np

from motor.io import read_color, to_grayscale
from motor.quality import QualityMetrics, compute_metrics, apply_clahe
from motor.segment import SegmentationResult, segment, check_viability
from motor.pipeline import process_image, process_batch, build_summary
from motor.report import gerar_relatorio, imprimir_resumo


def analisar_qualidade(gray: np.ndarray) -> QualityMetrics:
    """Analisa a qualidade de uma imagem em escala de cinza.

    Args:
        gray: Imagem em escala de cinza (numpy array 2-D, dtype uint8).

    Returns:
        ``QualityMetrics`` com média, desvio padrão, percentis e problemas
        detectados.
    """
    return compute_metrics(gray)


def aplicar_equalizacao(bgr: np.ndarray) -> np.ndarray:
    """Aplica correção CLAHE no canal de luminância.

    Args:
        bgr: Imagem colorida em formato BGR.

    Returns:
        Imagem BGR corrigida.
    """
    return apply_clahe(bgr)


def verificar_viabilidade_segmentacao(gray: np.ndarray) -> dict[str, Any]:
    """Verifica se a imagem possui separabilidade suficiente para segmentação.

    Args:
        gray: Imagem em escala de cinza.

    Returns:
        Dicionário com ``viavel`` (bool), ``separabilidade`` (float) e
        ``limiar_otsu`` (int).
    """
    viable, sep, thresh = check_viability(gray)
    return {
        "viavel": viable,
        "separabilidade": sep,
        "limiar_otsu": thresh,
    }


def segmentar_imagem(
    gray: np.ndarray,
    bgr: Optional[np.ndarray] = None,
) -> SegmentationResult:
    """Segmenta a imagem quando viável.

    Args:
        gray: Imagem em escala de cinza.
        bgr: Imagem colorida original (opcional). Se fornecida, gera
            artefatos coloridos adicionais.

    Returns:
        ``SegmentationResult`` com flag de viabilidade e artefatos.
    """
    return segment(gray, bgr=bgr)


def processar_imagem(
    caminho_imagem: str | Path,
    pasta_saida: Optional[str | Path] = None,
) -> dict[str, Any]:
    """Processa uma única imagem pelo pipeline completo.

    Args:
        caminho_imagem: Caminho do arquivo de imagem.
        pasta_saida: Diretório onde salvar artefatos (opcional).

    Returns:
        Dicionário estruturado com status, métricas e caminhos dos artefatos.
    """
    return process_image(caminho_imagem, output_dir=pasta_saida)


def processar_lote(
    pasta_entrada: str | Path,
    pasta_saida: Optional[str | Path] = None,
) -> dict[str, Any]:
    """Processa todas as imagens de um diretório.

    Args:
        pasta_entrada: Pasta contendo as imagens.
        pasta_saida: Diretório onde salvar artefatos (opcional).

    Returns:
        Dicionário com ``resultados`` (lista) e ``resumo`` (contagem por
        categoria).
    """
    return process_batch(pasta_entrada, output_dir=pasta_saida)
