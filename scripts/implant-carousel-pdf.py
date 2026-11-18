from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader
import json,subprocess,shutil,sys
root=Path(__file__).resolve().parents[1]
p=root/('output/projeto-02-implantes-1080x1440' if '--3x4' in sys.argv else 'output/projeto-02-acompanhamento-implantes')
specs=json.loads((p/'manifesto.json').read_text())
pdf=p/'02_FECHADO_PUBLICAR/CARROSSEL_CONFERENCIA.pdf'
c=canvas.Canvas(str(pdf),pageCompression=1)
c.setTitle('Odonto Personnallite - Acompanhamento dos implantes')
for item in specs:
 c.setPageSize((item['width'],item['height']))
 c.drawImage(ImageReader(str(p/'02_FECHADO_PUBLICAR'/item['file'].replace('.svg','.png'))),0,0,width=item['width'],height=item['height'])
 c.showPage()
c.save()
assert len(PdfReader(str(pdf)).pages)==6
preview=root/('tmp/pdfs/implantes-3x4' if '--3x4' in sys.argv else 'tmp/pdfs/implantes');preview.mkdir(parents=True,exist_ok=True)
subprocess.run([shutil.which('pdftoppm'),'-scale-to','540','-png',str(pdf),str(preview/'pagina')],check=True)
print('PDF: 5 slides + Story, páginas renderizadas.')
