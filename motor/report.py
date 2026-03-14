"""Geração de relatórios a partir dos resultados do pipeline."""

from __future__ import annotations

import csv
from datetime import datetime
from pathlib import Path
from typing import Any

from motor import config


# Colunas do CSV
_CSV_COLUMNS = [
    "arquivo",
    "status_cliente",
    "needs_equalization",
    "requires_human_review",
    "media_original",
    "std_original",
    "media_final",
    "std_final",
    "separabilidade_otsu",
    "limiar_otsu",
]


def gerar_relatorio(
    resultados: list[dict[str, Any]],
    pasta_relatorios: str | Path | None = None,
    nome_arquivo: str | None = None,
) -> Path:
    """Gera um relatório CSV consolidado a partir dos resultados do pipeline.

    Args:
        resultados: Lista de dicionários retornados por ``process_image`` ou
            ``process_batch``.
        pasta_relatorios: Pasta onde salvar o CSV. Se ``None``, usa
            ``config.REPORTS_DIR``.
        nome_arquivo: Nome do arquivo CSV. Se ``None``, gera um nome com
            timestamp.

    Returns:
        ``Path`` absoluto do relatório gerado.
    """
    if pasta_relatorios is None:
        pasta_relatorios = config.REPORTS_DIR
    pasta_relatorios = Path(pasta_relatorios)
    pasta_relatorios.mkdir(parents=True, exist_ok=True)

    if nome_arquivo is None:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        nome_arquivo = f"relatorio_{ts}.csv"

    report_path = pasta_relatorios / nome_arquivo

    with open(report_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=_CSV_COLUMNS)
        writer.writeheader()
        for r in resultados:
            orig = r.get("metricas_originais", {})
            final = r.get("metricas_finais", {})
            writer.writerow({
                "arquivo": r.get("arquivo"),
                "status_cliente": r.get("status_cliente"),
                "needs_equalization": r.get("needs_equalization"),
                "requires_human_review": r.get("requires_human_review"),
                "media_original": _fmt(orig.get("mean")),
                "std_original": _fmt(orig.get("std")),
                "media_final": _fmt(final.get("mean")),
                "std_final": _fmt(final.get("std")),
                "separabilidade_otsu": _fmt(r.get("separabilidade_otsu")),
                "limiar_otsu": r.get("limiar_otsu"),
            })

    return report_path.resolve()


def _fmt(value: Any) -> str:
    """Formata um valor numérico para o CSV."""
    if value is None:
        return ""
    if isinstance(value, float):
        return f"{value:.4f}"
    return str(value)
