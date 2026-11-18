from pathlib import Path
from html import escape
import zipfile
root=Path('output/identidade-visual/essencia-classica-editavel');root.mkdir(parents=True,exist_ok=True)
G='#17383B';A='#B59661';I='#F8F6EF'
def symbol(color):
 return f'''<g fill="none" stroke="{color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M150 52 C116 45 76 27 51 47 C17 73 35 123 49 167 C61 205 64 240 82 244 C96 247 108 198 120 169 C125 157 133 155 141 168 C157 195 168 243 183 243 C200 242 203 201 216 165 C235 112 247 66 218 45 C201 32 174 44 150 52 Z"/><path d="M133 57 C161 56 182 48 197 46"/></g><g fill="{color}"><path d="M101 82 H149 C187 82 207 101 207 128 C207 157 185 174 151 174 H127 V169 H148 C177 169 190 153 190 128 C190 104 177 88 148 88 H126 V222 H112 V96 C112 89 110 87 101 87 Z"/></g>'''
def svg(w,h,body):return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><title>Clínica Odonto Personnallite - Essência Clássica</title>{body}</svg>'
def word(x,y,color,size=66):
 return f'<g fill="{color}" text-anchor="middle" font-family="Georgia,serif"><text x="{x}" y="{y}" font-size="{size*.7}" letter-spacing="12">ODONTO</text><text x="{x}" y="{y+size*1.1}" font-size="{size}" letter-spacing="5">PERSONNALLITE</text></g>'
def principal(color=G,gold=A,bg=''):
 return svg(1200,850,(f'<rect width="1200" height="850" fill="{bg}"/>' if bg else '')+f'<g transform="translate(355 40) scale(1.9)">{symbol(gold)}</g>'+word(600,610,color)+f'<path d="M400 715 H800" stroke="{gold}" stroke-width="2"/><text x="600" y="770" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" letter-spacing="8" fill="{gold}">CLÍNICA ODONTOLÓGICA</text>')
files={'01-logo-principal-transparente.svg':principal(),'02-logo-principal-fundo-verde.svg':principal(I,A,G),'03-logo-monocromatica.svg':principal(G,G),'04-simbolo.svg':svg(280,280,f'<g transform="translate(10 0)">{symbol(A)}</g>'),'05-logo-horizontal.svg':svg(1500,400,f'<g transform="translate(40 30) scale(1.2)">{symbol(A)}</g>'+word(970,150,G,65)+f'<text x="970" y="285" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" letter-spacing="7" fill="{A}">CLÍNICA ODONTOLÓGICA</text>')}
body='<rect width="1200" height="650" fill="#fff"/><text x="70" y="70" font-family="Arial" font-size="30" fill="#17383B">ESSÊNCIA CLÁSSICA / PALETA</text>'
for n,(label,c) in enumerate([('Verde profundo',G),('Marfim',I),('Dourado suave',A)]):
 x=70+n*380;body+=f'<rect x="{x}" y="120" width="320" height="320" rx="8" fill="{c}" stroke="#ddd"/><text x="{x}" y="490" font-family="Arial" font-size="25" fill="{G}">{label}</text><text x="{x}" y="530" font-family="Arial" font-size="23" fill="{G}">{c}</text>'
files['06-paleta.svg']=svg(1200,650,body)
for name,content in files.items():(root/name).write_text(content,encoding='utf-8')
(root/'LEIA-ME.txt').write_text('ESSÊNCIA CLÁSSICA - PROPOSTA VETORIAL\n\nSVGs editáveis e PNGs separados. Símbolo redesenhado em curvas vetoriais como interpretação do conceito, não cópia exata do painel gerado por IA. Não substitui a marca atual automaticamente.\n\nNo Illustrator: Arquivo > Abrir > selecione o SVG. Desagrupe para editar símbolo, cores e textos. Textos permanecem editáveis; fonte sugerida Georgia para a marca e Arial para descritores. Confirme disponibilidade e licença das fontes na sua máquina. Antes da produção, revise espaçamento e converta uma cópia dos textos em contornos (Texto > Criar contornos), preservando o original editável.\n\nPNG principal/horizontal/símbolo têm fundo transparente; versão fundo verde é opaca. Dourado é cor sólida, sem efeito metálico. Fachada e cartões do painel são mockups ilustrativos e não estão embutidos nestes SVGs. Produção física requer medidas, sangria, perfis de cor e revisão gráfica.\n\nConceito para aprovação. Não foi feita pesquisa de exclusividade de marca. Nome: Clínica Odonto Personnallite.\n',encoding='utf-8')
print(root)
