"""Local recovery rehearsal using synthetic data only. Never connects to production."""
import sqlite3
import tempfile
from pathlib import Path

root = Path(__file__).resolve().parent.parent
source = sqlite3.connect(':memory:')
source.execute('PRAGMA foreign_keys=ON')
for schema in ['landing-pages/tratamento-humanizado/drizzle/0000_contact_requests.sql', 'infra/cloudflare/panel/schema.sql', 'infra/cloudflare/panel/workflow.sql', 'infra/cloudflare/panel/staff-photos.sql', 'infra/cloudflare/panel/operations.sql', 'infra/cloudflare/panel/agenda.sql']:
    source.executescript((root / schema).read_text(encoding='utf-8'))
source.execute("INSERT INTO contact_requests (request_id,name,phone,treatment,campaign,fingerprint,rate_key,acknowledged_at) VALUES ('synthetic','Contato fictício','91000000000','Avaliação','site-principal','fake','fake','2026-10-22')")
source.execute("INSERT INTO contact_request_workflow (request_id,assignee,updated_by) VALUES ('synthetic','atendente-1','demo@example.test')")
source.execute("INSERT INTO reception_appointments (request_id,professional,starts_at,ends_at,duration,status,updated_by) VALUES ('synthetic','Profissional fictício','2026-11-02T13:00:00.000Z','2026-11-02T13:30:00.000Z',30,'confirmed','demo@example.test')")
source.commit()
temp_root = root / 'tmp'
temp_root.mkdir(exist_ok=True)
assert temp_root.resolve().is_relative_to(root.resolve()), 'Pasta temporária fora do projeto'
with tempfile.TemporaryDirectory(prefix='odonto-synthetic-recovery-', dir=temp_root) as directory:
    backup = sqlite3.connect(str(Path(directory) / 'synthetic.sqlite'))
    source.backup(backup)
    restored = sqlite3.connect(':memory:')
    backup.backup(restored)
    assert restored.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
    assert restored.execute('PRAGMA foreign_key_check').fetchall() == []
    assert restored.execute('SELECT COUNT(*) FROM contact_requests').fetchone()[0] == 1
    assert restored.execute('SELECT assignee FROM contact_request_workflow').fetchone()[0] == 'atendente-1'
    assert restored.execute('SELECT duration FROM reception_appointments').fetchone()[0] == 30
    assert restored.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='trigger' AND name LIKE 'reception_appointments_%_conflict'").fetchone()[0] == 2
    restored.close()
    backup.close()
source.close()
print('OK: cópia e recuperação SQLite locais, integridade, relacionamentos e organização preservados com dados fictícios. Não valida Time Travel do D1 nem backup de produção.')
