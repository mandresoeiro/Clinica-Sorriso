from pathlib import Path
root=Path(__file__).resolve().parents[1]
for p in (root/'src').rglob('*.tsx'):
    if '.test.' in p.name: continue
    s=p.read_text(encoding='utf-8')
    if 'whatsappUrl' in s:
        s=s.replace('whatsappUrl', 'getWhatsAppUrl')
        s=s.replace('href={getWhatsAppUrl}', 'href={getWhatsAppUrl()}')
        s=s.replace(' : getWhatsAppUrl\n', ' : getWhatsAppUrl()\n')
    if p.name in ['Prostheses.tsx','PriorityService.tsx','FirstVisit.tsx','AppointmentForm.tsx','WhatsAppButton.tsx']:
        if 'getWhatsAppUrl' not in s.split('\n',10)[0:10].__str__():
            s=s.replace('import { siteConfig }', 'import { siteConfig, getWhatsAppUrl }')
        lines=s.splitlines()
        for i,line in enumerate(lines):
            if 'const contact = `https://wa.me/' in line:
                message="'Olá! Conheci a página de próteses dentárias e gostaria de consultar horários para uma avaliação.'" if p.name=='Prostheses.tsx' else 'service.message'
                lines[i]='  const contact = getWhatsAppUrl('+message+')'
            elif 'const url = `https://wa.me/' in line:
                lines[i]='    const url = getWhatsAppUrl(text)' if p.name=='AppointmentForm.tsx' else '  const url = getWhatsAppUrl(message)'
            elif 'const contactUrl = message ? `https://wa.me/' in line:
                lines[i]='  const contactUrl = getWhatsAppUrl(message)'
        s='\n'.join(lines)+'\n'
        if p.name=='WhatsAppButton.tsx': s=s.replace('import { siteConfig, getWhatsAppUrl }', 'import { getWhatsAppUrl }')
        if p.name=='AppointmentForm.tsx': s=s.replace('import { siteConfig, getWhatsAppUrl }', 'import { siteConfig, getWhatsAppUrl }')
    if s!=p.read_text(encoding='utf-8'): p.write_text(s,encoding='utf-8')
p=root/'src/pages/Privacy.tsx'
s=p.read_text(encoding='utf-8').replace('Atualizado em 7 de outubro de 2026','Atualizado em 13 de outubro de 2026')
s=s.replace('O código atual do site não instala cookies de publicidade', 'Quando o link contém identificadores de campanha aceitos (origem, meio e código da campanha), eles ficam apenas na memória desta aba durante a navegação e podem integrar a mensagem que você escolhe abrir no WhatsApp. Não coletamos o endereço completo de referência, identificadores de clique ou dados dos campos para essa identificação. Recarregar ou fechar a página elimina essa memória, salvo se o próprio endereço aberto ainda contiver os identificadores. Essa identificação não comprova envio de mensagem ou agendamento. O código atual do site não instala cookies de publicidade')
p.write_text(s,encoding='utf-8')
