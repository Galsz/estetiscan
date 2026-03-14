"""Operações de leitura, escrita e conversão de imagens."""

from __future__ import annotations

from pathlib import Path
from typing import Optional

import cv2
import numpy as np

from motor.config import SUPPORTED_EXTENSIONS


def read_color(path: str | Path) -> np.ndarray:
    """Lê uma imagem colorida (BGR) a partir de um caminho.

    Raises:
        FileNotFoundError: Se o arquivo não existir.
        ValueError: Se a extensão não for suportada ou a leitura falhar.
    """
    path = Path(path)
    if not path.is_file():
        raise FileNotFoundError(f"Arquivo não encontrado: {path}")
    if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        raise ValueError(f"Extensão não suportada: {path.suffix}")

    img = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError(f"Não foi possível decodificar a imagem: {path}")
    return img


def to_grayscale(bgr: np.ndarray) -> np.ndarray:
    """Converte imagem BGR para escala de cinza."""
    return cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)


def save_image(image: np.ndarray, path: str | Path) -> Path:
    """Salva uma imagem no disco, criando diretórios se necessário.

    Returns:
        O ``Path`` absoluto do arquivo salvo.
    """
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(path), image)
    return path.resolve()


def list_images(directory: str | Path) -> list[Path]:
    """Lista todos os arquivos de imagem suportados em um diretório.

    Não faz busca recursiva.
    """
    directory = Path(directory)
    if not directory.is_dir():
        raise FileNotFoundError(f"Diretório não encontrado: {directory}")
    return sorted(
        p for p in directory.iterdir()
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS
    )
