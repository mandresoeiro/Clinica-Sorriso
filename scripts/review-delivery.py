from pathlib import Path
import re, json, hashlib, shutil
root=Path(__file__).resolve().parents[1]
source=root/'output/pdf/projeto-comercial-odonto-personnallite.pdf'
assert source.is_file(), 'PDF final ausente'
target=root/'public/propostas'/source.name
shutil.copy2(source,target)
# A aplicação já foi compilada e testada. Esta alteração é somente um arquivo público.
dist=root/'dist/propostas'/source.name
assert (root/'dist/index.html').is_file(), 'Build ausente'
dist.parent.mkdir(parents=True,exist_ok=True)
shutil.copy2(source,dist)
digest=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert digest(source)==digest(target)==digest(dist)
references=set()
for p in (root/'src').rglob('*'):
    if p.suffix not in ['.ts','.tsx','.css'] or '.test.' in p.name: continue
    references.update(re.findall(r'''["'](/(?:images|propostas)/[^"'{}$\s]+)["']''',p.read_text(encoding='utf-8')))
missing=[url for url in sorted(references) if not (root/'public'/url.lstrip('/')).is_file()]
assert not missing, f'Arquivos públicos ausentes: {missing}'
assert 'noindex,nofollow' in (root/'index.html').read_text(encoding='utf-8')
assert 'Disallow: /' in (root/'public/robots.txt').read_text(encoding='utf-8')
result={'data':'2026-10-13','arquivos_publicos_referenciados':len(references),'arquivos_ausentes':missing,'pdf_final_sha256':digest(source),'pdf_publico_sincronizado':True,'demonstracao_sem_indexacao':True,'limite':'Verificação de referências literais locais e arquivos. Não substitui conferência visual, teste de todas as rotas ou validação dos dados da clínica.'}
(root/'docs/revisao-entrega-2026-10-13.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
