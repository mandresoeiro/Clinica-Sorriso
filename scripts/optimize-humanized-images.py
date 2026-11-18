"""Generate smaller mobile assets; preserve all existing image files."""
from pathlib import Path
from PIL import Image, ImageOps

assets = Path(__file__).resolve().parent.parent / 'landing-pages/tratamento-humanizado/web/assets'
for source, target in [
    ('rosto-sorriso.png', 'rosto-sorriso-480.webp'),
    ('conversa-ilustrativa-2026.webp', 'conversa-ilustrativa-480.webp'),
    ('cuidado-ilustrativo-2026.webp', 'cuidado-ilustrativo-480.webp'),
]:
    with Image.open(assets / source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        image.thumbnail((480, 480), Image.Resampling.LANCZOS)
        image.save(assets / target, 'WEBP', quality=85, method=6)
        print(f'{target}: {(assets / target).stat().st_size} bytes')
