"""Pipeline principal: orquestra análise, correção, segmentação e classificação."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

import numpy as np

from motor import config
from motor.io import read_color, to_grayscale, save_image, list_images
from motor.quality import (
    QualityMetrics,
    compute_metrics,
    needs_correction,
    apply_clahe,
    validate_correction,
)
from motor.segment import SegmentationResult, segment


# ---------------------------------------------------------------------------
# Tipo de retorno estruturado
# ---------------------------------------------------------------------------

def _build_result(
    filename: str,
    status: str,
    original_metrics: QualityMetrics,
    final_metrics: QualityMetrics,
    seg_result: Optional[SegmentationResult],
    artifacts: dict[str, Optional[str]],
    needs_eq: bool,
    requires_review: bool,
    validation_details: Optional[dict[str, Any]] = None,
) -> dict[str, Any]:
    """Monta o dicionário de retorno padronizado para uma imagem."""
    return {
        "arquivo": filename,
        "status_cliente": status,
        "needs_equalization": needs_eq,
        "requires_human_review": requires_review,
        "metricas_originais": original_metrics.to_dict(),
        "metricas_finais": final_metrics.to_dict(),
        "separabilidade_otsu": seg_result.separability if seg_result else None,
        "limiar_otsu": seg_result.otsu_threshold if seg_result else None,
        "artefatos": artifacts,
        "detalhes_validacao": validation_details,
    }


# ---------------------------------------------------------------------------
# Processamento de uma única imagem
# ---------------------------------------------------------------------------

def process_image(
    image_path: str | Path,
    output_dir: Optional[str | Path] = None,
) -> dict[str, Any]:
    """Processa uma única imagem pelo pipeline completo.

    Etapas:
        1. Leitura e conversão para cinza.
        2. Análise de qualidade.
        3. Correção automática (se necessário) + validação de ganho.
        4. Verificação de viabilidade de segmentação.
        5. Segmentação (se viável) ou encaminhamento para revisão humana.
        6. Salvamento dos artefatos e retorno do resultado.

    Args:
        image_path: Caminho da imagem de entrada.
        output_dir: Diretório raiz para salvar artefatos.  Se ``None``, usa
            ``config.PROCESSED_DIR``.

    Returns:
        Dicionário estruturado com status, métricas e caminhos dos artefatos.
    """
    image_path = Path(image_path)
    if output_dir is None:
        output_dir = config.PROCESSED_DIR
    output_dir = Path(output_dir)

    stem = image_path.stem
    ext = image_path.suffix

    # --- 1. Leitura -------------------------------------------------------
    bgr = read_color(image_path)
    gray = to_grayscale(bgr)

    # --- 2. Análise de qualidade -------------------------------------------
    orig_metrics = compute_metrics(gray)

    # Artefatos parciais
    artifacts: dict[str, Optional[str]] = {
        "orig_color": None,
        "gray": None,
        "eq_color": None,
        "eq_gray": None,
        "bin": None,
        "seg_color": None,
        "seg_crop": None,
    }

    img_dir = output_dir / stem
    artifacts["orig_color"] = str(save_image(bgr, img_dir / f"{stem}_orig{ext}"))
    artifacts["gray"] = str(save_image(gray, img_dir / f"{stem}_gray.png"))

    # --- 3. Correção automática (se necessário) ----------------------------
    corrected_bgr: Optional[np.ndarray] = None
    corrected_gray: Optional[np.ndarray] = None
    final_metrics = orig_metrics
    correction_applied = False
    correction_valid = False
    validation_details: Optional[dict[str, Any]] = None

    if needs_correction(orig_metrics):
        corrected_bgr = apply_clahe(bgr)
        corrected_gray = to_grayscale(corrected_bgr)
        correction_valid, corrected_metrics = validate_correction(
            orig_metrics, corrected_gray,
        )
        validation_details = {
            "correction_attempted": True,
            "correction_accepted": correction_valid,
            "std_gain": corrected_metrics.std - orig_metrics.std,
            "mean_shift": abs(corrected_metrics.mean - orig_metrics.mean),
        }

        if correction_valid:
            correction_applied = True
            final_metrics = corrected_metrics
            artifacts["eq_color"] = str(
                save_image(corrected_bgr, img_dir / f"{stem}_eq{ext}")
            )
            artifacts["eq_gray"] = str(
                save_image(corrected_gray, img_dir / f"{stem}_eq_gray.png")
            )
    else:
        validation_details = {"correction_attempted": False}

    # Decide qual imagem usar para segmentação
    working_bgr = corrected_bgr if correction_applied else bgr
    working_gray = corrected_gray if correction_applied else gray

    # --- 4 & 5. Segmentação -----------------------------------------------
    seg_result = segment(working_gray, bgr=working_bgr)

    if seg_result.viable:
        if seg_result.binary is not None:
            artifacts["bin"] = str(
                save_image(seg_result.binary, img_dir / f"{stem}_bin.png")
            )
        if seg_result.segmented_color is not None:
            artifacts["seg_color"] = str(
                save_image(seg_result.segmented_color, img_dir / f"{stem}_seg{ext}")
            )
        if seg_result.segmented_crop is not None:
            artifacts["seg_crop"] = str(
                save_image(seg_result.segmented_crop, img_dir / f"{stem}_crop{ext}")
            )

    # --- 6. Classificação final -------------------------------------------
    status = _classify(orig_metrics, correction_applied, correction_valid, seg_result)
    requires_review = status == config.STATUS_HUMAN_REVIEW

    # Copiar original para pasta de revisão humana se necessário
    if requires_review:
        review_path = config.REVIEW_DIR / f"{stem}{ext}"
        save_image(bgr, review_path)

    return _build_result(
        filename=image_path.name,
        status=status,
        original_metrics=orig_metrics,
        final_metrics=final_metrics,
        seg_result=seg_result,
        artifacts=artifacts,
        needs_eq=needs_correction(orig_metrics),
        requires_review=requires_review,
        validation_details=validation_details,
    )


# ---------------------------------------------------------------------------
# Processamento em lote
# ---------------------------------------------------------------------------

def process_batch(
    input_dir: str | Path,
    output_dir: Optional[str | Path] = None,
) -> dict[str, Any]:
    """Processa todas as imagens suportadas de um diretório.

    Args:
        input_dir: Pasta com as imagens de entrada.
        output_dir: Diretório raiz para artefatos.

    Returns:
        Dicionário com ``resultados`` (lista) e ``resumo`` (contagem por
        categoria).
    """
    images = list_images(input_dir)
    results: list[dict[str, Any]] = []
    total = len(images)

    for idx, img_path in enumerate(images, 1):
        print(f"[{idx}/{total}] Processando: {img_path.name}")
        result = process_image(img_path, output_dir=output_dir)
        results.append(result)
        print(f"          -> {result['status_cliente']}")

    summary = build_summary(results)
    return {"resultados": results, "resumo": summary}


def build_summary(results: list[dict[str, Any]]) -> dict[str, Any]:
    """Gera um resumo com contagem por categoria."""
    categories = [
        config.STATUS_IDEAL,
        config.STATUS_ADEQUATE,
        config.STATUS_AUTO_CORRECTED,
        config.STATUS_NO_GAIN,
        config.STATUS_HUMAN_REVIEW,
    ]
    counts = {cat: 0 for cat in categories}
    for r in results:
        status = r.get("status_cliente", "")
        if status in counts:
            counts[status] += 1

    return {
        "total": len(results),
        "contagem": counts,
        "revisao_humana_arquivos": [
            r["arquivo"] for r in results
            if r.get("requires_human_review")
        ],
    }


# ---------------------------------------------------------------------------
# Lógica de classificação
# ---------------------------------------------------------------------------

def _classify(
    orig_metrics: QualityMetrics,
    correction_applied: bool,
    correction_valid: bool,
    seg_result: Optional[SegmentationResult],
) -> str:
    """Determina o status final da imagem.

    Fluxo alinhado com o motor descrito no README:
      1. Análise de contraste → se baixo, equaliza.
      2. Análise de bimodalidade (Otsu) → viável para limiarização?
      3. Ação final: segmenta ou encaminha para revisão humana.

    Usa ``needs_correction`` para distinguir problemas corrigíveis
    (brilho/contraste) de problemas informacionais (nitidez, clipping)
    que não devem bloquear a classificação.
    """
    had_correctable_issues = needs_correction(orig_metrics)
    segmentation_ok = seg_result is not None and seg_result.viable

    # --- Imagem sem problemas de contraste/brilho -------------------------
    if not had_correctable_issues:
        # Bimodal → ideal; não bimodal → adequada (usável mas sem segmentação)
        return config.STATUS_IDEAL if segmentation_ok else config.STATUS_ADEQUATE

    # --- Imagem tinha problema de contraste/brilho ------------------------

    # Corrigida com sucesso + histograma bimodal → aprovada como corrigida
    if correction_applied and segmentation_ok:
        return config.STATUS_AUTO_CORRECTED

    # Corrigida mas histograma não bimodal → complexa, revisão humana
    if correction_applied and not segmentation_ok:
        return config.STATUS_HUMAN_REVIEW

    # Correção tentada sem ganho relevante
    if not correction_valid:
        return config.STATUS_NO_GAIN

    # Caso residual
    return config.STATUS_HUMAN_REVIEW

    # Qualquer outro caso → revisão humana
    return config.STATUS_HUMAN_REVIEW
