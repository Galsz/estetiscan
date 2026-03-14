"""Configurações e limiares do motor de processamento."""

from pathlib import Path

# ---------------------------------------------------------------------------
# Diretórios padrão
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
ORIGINAL_DIR = DATA_DIR / "original"
PROCESSED_DIR = DATA_DIR / "processed"
REVIEW_DIR = DATA_DIR / "review_human"
REPORTS_DIR = BASE_DIR / "reports"

# ---------------------------------------------------------------------------
# Limiares de qualidade de imagem
# ---------------------------------------------------------------------------
# Intensidade média (escala 0-255)
# 80: imagens com média abaixo de 80 são visivelmente escuras em fotos clínicas
MEAN_TOO_DARK: float = 80.0
# 200: acima de 200 já há perda de detalhe em tons claros
MEAN_TOO_BRIGHT: float = 200.0

# Desvio padrão mínimo para considerar contraste aceitável
# 40: captura imagens com contraste visivelmente fraco (std 35-40)
STD_LOW_CONTRAST: float = 40.0

# Percentual máximo de pixels saturados em preto ou branco
CLIPPED_BLACK_THRESHOLD: float = 0.25   # 25 % dos pixels em [0, 10]
CLIPPED_WHITE_THRESHOLD: float = 0.25   # 25 % dos pixels em [245, 255]

# Variância do Laplaciano — limiar mínimo de nitidez.
# Fotos clínicas de pele e close-ups têm Laplaciano natural entre 10–40.
# Apenas valores abaixo de 10 indicam blur genuíno.
LAPLACIAN_BLUR_THRESHOLD: float = 10.0

# ---------------------------------------------------------------------------
# CLAHE (Contrast Limited Adaptive Histogram Equalization)
# ---------------------------------------------------------------------------
CLAHE_CLIP_LIMIT: float = 2.0
CLAHE_TILE_SIZE: tuple[int, int] = (8, 8)

# ---------------------------------------------------------------------------
# Validação de ganho após correção
# ---------------------------------------------------------------------------
# Ganho mínimo de desvio padrão para considerar a correção relevante.
# 2.0: aceitar melhorias menores mas reais (antes 3.0 rejeitava correções válidas).
MIN_STD_GAIN: float = 2.0

# Diferença máxima tolerável na média antes de rejeitar correção.
# 60: deslocamentos maiores indicam distorção excessiva.
MAX_MEAN_SHIFT: float = 60.0

# ---------------------------------------------------------------------------
# Separabilidade / Otsu
# ---------------------------------------------------------------------------
# Limiar mínimo de separabilidade inter-classe (entre 0 e 1)
OTSU_SEPARABILITY_THRESHOLD: float = 0.35

# ---------------------------------------------------------------------------
# Classificações de saída
# ---------------------------------------------------------------------------
STATUS_IDEAL = "ideal"
STATUS_ADEQUATE = "adequada"
STATUS_AUTO_CORRECTED = "corrigida_automaticamente"
STATUS_NO_GAIN = "ajuste_sem_ganho_relevante"
STATUS_HUMAN_REVIEW = "requer_revisao_humana"

# ---------------------------------------------------------------------------
# Extensões de imagem aceitas
# ---------------------------------------------------------------------------
SUPPORTED_EXTENSIONS: set[str] = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".webp"}
