from pathlib import Path
import os
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
output = root / 'output/landing-humanizado/Implantacao_Dominio_Django.zip'
excluded = {'.git', '.venv', '__pycache__', 'node_modules', 'staticfiles', 'frontend'}
allowed = ['dist', 'backend', 'infra/nginx/personnallite-production.conf', 'docs/landing-pages', 'scripts/prepare-humanized-landing.mjs', 'scripts/test-humanized-landing.mjs']
output.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for item in allowed:
        path = root / item
        files = []
        if path.is_dir():
            for current, dirs, names in os.walk(path, followlinks=False):
                dirs[:] = [name for name in dirs if name not in excluded]
                files.extend(Path(current) / name for name in names)
        else:
            files = [path]
        for file in files:
            if any(part in excluded for part in file.relative_to(root).parts):
                continue
            if file.is_symlink() or not file.is_file():
                continue
            relative = file.relative_to(root)
            if any(part in excluded for part in relative.parts):
                continue
            if file.suffix in {'.sqlite3', '.pyc', '.log'} or (file.name.startswith('.env') and not file.name.endswith('.example')):
                continue
            archive.write(file, relative.as_posix())
print(output)

with ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'dist/tratamento-humanizado/contact.js' in archive.namelist()
    assert 'backend/compose.production.yaml' in archive.namelist()
    assert not any('/.venv/' in name or name.endswith('/.env.production') for name in archive.namelist())
print('Pacote validado: arquivos da página e backend incluídos, sem ambiente virtual ou credenciais reais.')
