from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
for name in ('recepcao-ia', 'consultorio-ia'):
    source = root / 'src/assets/demo' / (name + '.png')
    target = source.with_suffix('.webp')
    with Image.open(source) as image:
        image = image.convert('RGB')
        image.thumbnail((1122, 1402))
        image.save(target, 'WEBP', quality=82, method=6)
    print(f'{name}: {source.stat().st_size} -> {target.stat().st_size} bytes')
    (root / 'public/images/demo' / (name + '.webp')).write_bytes(target.read_bytes())
for file in (root / 'src').rglob('*'):
    if file.suffix not in ('.tsx', '.ts'):
        continue
    source = file.read_text(encoding='utf-8')
    result = source
    for name in ('recepcao-ia', 'consultorio-ia'):
        result = result.replace(f'assets/demo/{name}.png', f'assets/demo/{name}.webp')
        result = result.replace(f'/images/demo/{name}.png', f'/images/demo/{name}.webp')
    if result != source:
        file.write_text(result, encoding='utf-8')
