"""Geração de galeria de amostras visuais por categoria do pipeline."""

from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Any, Optional

import cv2
import numpy as np

from motor import config


# ---------------------------------------------------------------------------
# Categorias de interesse para a galeria
# ---------------------------------------------------------------------------

ALL_CATEGORIES = [
    config.STATUS_IDEAL,
    config.STATUS_ADEQUATE,
    config.STATUS_AUTO_CORRECTED,
    config.STATUS_NO_GAIN,
    config.STATUS_HUMAN_REVIEW,
]


def gerar_galeria(
    resultados: list[dict[str, Any]],
    pasta_galeria: str | Path | None = None,
    max_por_categoria: int = 3,
) -> dict[str, Any]:
    """Gera uma pasta de amostras visuais organizada por categoria.

    Para cada categoria presente nos resultados, copia até
    ``max_por_categoria`` imagens (original + artefatos) em subpastas
    nomeadas pelo status.  Gera também um painel-resumo (PNG) e um
    arquivo ``galeria.json`` com os metadados das amostras escolhidas.

    Args:
        resultados: Lista de dicionários retornados pelo pipeline.
        pasta_galeria: Diretório onde criar a galeria.  Se ``None``, usa
            ``<BASE_DIR>/galeria/``.
        max_por_categoria: Quantidade máxima de exemplos por categoria.

    Returns:
        Dicionário com ``pasta`` (Path), ``amostras`` (dict por categoria)
        e ``painel`` (Path do painel-resumo PNG).
    """
    if pasta_galeria is None:
        pasta_galeria = config.BASE_DIR / "galeria"
    pasta_galeria = Path(pasta_galeria)
    pasta_galeria.mkdir(parents=True, exist_ok=True)

    # Agrupar resultados por status
    agrupados: dict[str, list[dict[str, Any]]] = {cat: [] for cat in ALL_CATEGORIES}
    for r in resultados:
        status = r.get("status_cliente", "")
        if status in agrupados:
            agrupados[status].append(r)

    amostras: dict[str, list[dict[str, Any]]] = {}

    for categoria, itens in agrupados.items():
        selecionados = itens[:max_por_categoria]
        if not selecionados:
            continue

        cat_dir = pasta_galeria / categoria
        cat_dir.mkdir(parents=True, exist_ok=True)

        amostras[categoria] = []
        for r in selecionados:
            artefatos = r.get("artefatos", {})
            copiados: dict[str, Optional[str]] = {}

            for chave, caminho in artefatos.items():
                if caminho is None:
                    copiados[chave] = None
                    continue
                src = Path(caminho)
                if src.is_file():
                    dst = cat_dir / src.name
                    shutil.copy2(src, dst)
                    copiados[chave] = str(dst)
                else:
                    copiados[chave] = None

            amostra = {
                "arquivo": r.get("arquivo"),
                "status_cliente": categoria,
                "separabilidade_otsu": r.get("separabilidade_otsu"),
                "limiar_otsu": r.get("limiar_otsu"),
                "needs_equalization": r.get("needs_equalization"),
                "artefatos": copiados,
            }
            amostras[categoria].append(amostra)

    # Salvar resumo JSON
    resumo_path = pasta_galeria / "galeria.json"
    resumo_json = {
        cat: [
            {k: v for k, v in a.items() if k != "artefatos"}
            for a in items
        ]
        for cat, items in amostras.items()
    }
    resumo_path.write_text(
        json.dumps(resumo_json, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    # Gerar painel-resumo visual
    painel_path = _gerar_painel(amostras, pasta_galeria)

    # Imprimir resumo no console
    _imprimir_galeria(amostras)

    return {
        "pasta": pasta_galeria.resolve(),
        "amostras": amostras,
        "painel": painel_path,
        "resumo_json": resumo_path.resolve(),
    }


# ---------------------------------------------------------------------------
# Painel visual composto
# ---------------------------------------------------------------------------

_LABEL_COLORS = {
    config.STATUS_IDEAL: (46, 204, 113),
    config.STATUS_ADEQUATE: (52, 152, 219),
    config.STATUS_AUTO_CORRECTED: (243, 156, 18),
    config.STATUS_NO_GAIN: (230, 126, 34),
    config.STATUS_HUMAN_REVIEW: (231, 76, 60),
}

_THUMB_SIZE = (256, 256)


def _gerar_painel(
    amostras: dict[str, list[dict[str, Any]]],
    pasta_galeria: Path,
) -> Optional[Path]:
    """Gera um painel PNG com thumbnails organizados por categoria."""
    if not amostras:
        return None

    thumb_w, thumb_h = _THUMB_SIZE
    label_h = 36
    padding = 10

    max_cols = max(len(items) for items in amostras.values())
    n_rows = len(amostras)

    canvas_w = padding + max_cols * (thumb_w + padding)
    canvas_h = padding + n_rows * (label_h + thumb_h + padding)

    canvas = np.full((canvas_h, canvas_w, 3), 255, dtype=np.uint8)

    y = padding
    for categoria, items in amostras.items():
        color_bgr = _LABEL_COLORS.get(categoria, (150, 150, 150))

        # Barra de label
        cv2.rectangle(canvas, (0, y), (canvas_w, y + label_h), color_bgr, -1)
        cv2.putText(
            canvas,
            f"  {categoria.upper()}  ({len(items)})",
            (padding, y + label_h - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2,
        )
        y += label_h

        x = padding
        for amostra in items:
            orig_path = (amostra.get("artefatos") or {}).get("orig_color")
            if orig_path and Path(orig_path).is_file():
                img = cv2.imread(orig_path)
                thumb = cv2.resize(img, _THUMB_SIZE)
            else:
                thumb = np.full((thumb_h, thumb_w, 3), 200, dtype=np.uint8)
                cv2.putText(
                    thumb, "N/A", (80, 140),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (100, 100, 100), 3,
                )

            canvas[y : y + thumb_h, x : x + thumb_w] = thumb
            x += thumb_w + padding

        y += thumb_h + padding

    painel_path = pasta_galeria / "painel_resumo.png"
    cv2.imwrite(str(painel_path), canvas)
    return painel_path.resolve()


# ---------------------------------------------------------------------------
# Impressão no console
# ---------------------------------------------------------------------------

def _imprimir_galeria(amostras: dict[str, list[dict[str, Any]]]) -> None:
    """Imprime o resumo da galeria gerada."""
    print("\n" + "=" * 55)
    print("  GALERIA DE AMOSTRAS VISUAIS")
    print("=" * 55)

    total = 0
    for categoria in ALL_CATEGORIES:
        items = amostras.get(categoria, [])
        count = len(items)
        total += count
        marker = "●" if count > 0 else "○"
        print(f"  {marker} {categoria:40s} {count} amostra(s)")
        for a in items:
            print(f"      └─ {a['arquivo']}")

    print(f"\n  Total de amostras: {total}")
    print("=" * 55 + "\n")
