"""Backup manual PostgreSQL. Não altera nem remove o banco de origem."""
import argparse
from datetime import datetime, timezone
import os
from pathlib import Path
import shutil
import subprocess
import tempfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', required=True, type=Path,
                        help='Pasta privada; não usar public/, Git ou pasta compartilhada.')
    parser.add_argument('--compose-file', type=Path,
                        default=Path(__file__).resolve().parents[1] / 'backend' / 'compose.yaml')
    parser.add_argument('--compose-executable', help='Executável standalone docker-compose, se necessário.')
    args = parser.parse_args()
    compose = ([args.compose_executable] if args.compose_executable else ['docker', 'compose'])
    prefix = compose + ['-f', str(args.compose_file.resolve())]
    args.output_dir.mkdir(parents=True, exist_ok=True)
    destination = args.output_dir / ('personnallite-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ') + '.dump')
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(dir=args.output_dir, prefix='.backup-', delete=False) as stream:
            temp_path = Path(stream.name)
            subprocess.run(prefix + ['exec', '-T', 'db', 'sh', '-c',
                'exec pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc'],
                stdout=stream, check=True)
        with temp_path.open('rb') as stream:
            if stream.read(5) != b'PGDMP':
                raise RuntimeError('Arquivo não reconhecido como backup PostgreSQL.')
        # Verifica o catálogo sem restaurar ou alterar dados.
        with temp_path.open('rb') as stream:
            subprocess.run(prefix + ['exec', '-T', 'db', 'pg_restore', '--list'],
                           stdin=stream, stdout=subprocess.DEVNULL, check=True)
        os.replace(temp_path, destination)
        temp_path = None
        print('Backup criado e catálogo validado:', destination)
        print('Ainda é necessário testar a restauração em banco isolado.')
    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)


if __name__ == '__main__':
    main()
