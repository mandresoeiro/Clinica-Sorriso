from pathlib import Path
import csv, hashlib, io
root=Path('J:/Meu Drive/05_Trabalho_e_Projetos/Odonto Personnallite')
manifest=root/'INVENTARIO-2026-10-13.csv'
raw=manifest.read_text(encoding='utf-8-sig')
def normalize(text):
    if 'Ã' not in text and 'Â' not in text: return text
    try: return text.encode('cp1252').decode('utf-8')
    except (UnicodeEncodeError, UnicodeDecodeError): return text
rows=list(csv.DictReader(io.StringIO(raw),delimiter=';'))
for row in rows:
    p=root/row['Arquivo']
    assert p.is_file(), p
    if 'drive-note-' not in row['Origem']:
        assert hashlib.sha256(p.read_bytes()).hexdigest().upper()==row['SHA256'], p
    if 'drive-note-' in row['Origem']:
        text=p.read_text(encoding='utf-8-sig')
        fixed=normalize(text)
        if fixed!=text: p.write_text(fixed,encoding='utf-8-sig')
        assert not any(token in fixed for token in ['Ã§','Ã£','Ã©','Ã³','Ã¡']), p
        row['SHA256']=hashlib.sha256(p.read_bytes()).hexdigest().upper()
    row['Situacao']=normalize(row['Situacao'])
with manifest.open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=list(rows[0]),delimiter=';')
    writer.writeheader();writer.writerows(rows)
assert len(list(csv.DictReader((root/'PENDENCIAS-DA-CLINICA.csv').open(encoding='utf-8-sig'),delimiter=';')))==13
assert not list((root/'07_Entregas_aprovadas').iterdir())
print(f'{len(rows)} arquivos do inventário verificados. Acentos e pendências conferidos. Entregas aprovadas: vazia.')
