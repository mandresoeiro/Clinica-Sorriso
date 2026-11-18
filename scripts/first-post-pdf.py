from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader
import subprocess, shutil
root=Path(__file__).resolve().parents[1]
p=root/'output/primeiro-post-escova-macia/02_FECHADO_PUBLICAR'
pdf=p/'ARTES_FECHADAS_CONFERENCIA.pdf'
c=canvas.Canvas(str(pdf),pageCompression=1)
c.setTitle('Odonto Personnallite - Escova macia. Cuidado diario.')
for name,h in [('FEED_1080x1350',1350),('STORY_1080x1920',1920),('CAPA_REEL_1080x1920',1920)]:
    c.setPageSize((1080,h));c.drawImage(ImageReader(str(p/(name+'.png'))),0,0,width=1080,height=h);c.showPage()
c.save()
reader=PdfReader(str(pdf));assert len(reader.pages)==3
assert not reader.get_fields()
preview=root/'tmp/pdfs/primeiro-post';preview.mkdir(parents=True,exist_ok=True)
subprocess.run([shutil.which('pdftoppm'),'-scale-to','760','-png',str(pdf),str(preview/'pagina')],check=True)
print('PDF fechado: 3 paginas, sem campos. Previa renderizada.')
