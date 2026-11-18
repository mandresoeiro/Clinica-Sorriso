from pathlib import Path
import re
p=Path(__file__).with_name('create-project-pdf.py')
s=p.read_text(encoding='utf-8')
changes={
"'Diagnóstico, checklist e coordenação da finalização.','R$ 200,00'":"'Diagnóstico, checklist e coordenação da finalização.','R$ 100,00'",
"'Dados, navegação, conteúdo e ajustes na estrutura existente.','R$ 350,00'":"'Dados, navegação, conteúdo e ajustes na estrutura existente.','R$ 175,00'",
"'Finalização de /proteses e duas urgências; R$ 200,00 por página.','R$ 600,00'":"'Finalização de /proteses e duas urgências; R$ 100,00 por página.','R$ 300,00'",
"'Bio, links, seis capas e até seis stories iniciais.','R$ 200,00'":"'Bio, links, seis capas e até seis stories iniciais.','R$ 100,00'",
"'Roteiros, respostas rápidas, etiquetas e orientação.','R$ 100,00'":"'Roteiros, respostas rápidas, etiquetas e orientação.','R$ 50,00'",
"'Acessos, uma campanha, um conjunto e até dois anúncios.','R$ 150,00'":"'Acessos, uma campanha, um conjunto e até dois anúncios.','R$ 75,00'",
"'UTMs, análise/eventos viáveis e planilha simples.','R$ 100,00'":"'UTMs, análise/eventos viáveis e planilha simples.','R$ 50,00'",
"'Domínio/DNS, publicação, testes e instruções; taxas externas à parte.','R$ 100,00'":"'Domínio/DNS, publicação, testes e instruções; taxas externas à parte.','R$ 50,00'",
"'Acompanhamento e ajustes no limite do escopo da página 7.','R$ 350,00'":"'Acompanhamento de uma campanha e ajustes no escopo da página 7.','R$ 200,00'",
"'2 posts, 4 stories e até 2 adaptações para anúncios.','R$ 200,00'":"'2 posts, 4 stories e até 2 adaptações para anúncios.','R$ 100,00'",
"'Até 1 hora de ajustes simples, checagem técnica, relatório e reunião de 30 min.','R$ 100,00'":"'Até 30 minutos de ajustes simples, checagem técnica e resumo mensal.','R$ 50,00'",
"3 parcelas de R$ 600,00":"3 parcelas de R$ 300,00",
"Até duas verificações por semana útil":"Uma verificação por semana útil",
"Até duas campanhas ativas no escopo mensal, mas iniciar com uma para não fragmentar os R$ 300,00 de mídia. Segunda campanha depende de verba e capacidade.":"Uma campanha ativa no escopo mensal, para não fragmentar os R$ 300,00 de mídia. Campanhas adicionais exigem novo orçamento.",
"Um relatório simples com gastos, indicadores disponíveis, resultados informados, limitações e próximos ajustes. Inclui uma reunião remota de até 30 minutos.":"Um resumo mensal por mensagem ou PDF com gastos, indicadores disponíveis, resultados informados, limitações e próximos ajustes. Reuniões extras ficam fora desta condição acessível.",
"Inclui checagem e até 1 hora de ajustes simples por mês.":"Inclui checagem e até 30 minutos de ajustes simples por mês.",
"Versão 1.0":"Versão 1.1",
"assert len(r.pages)==14":"assert len(r.pages)==15",
"assert sum([200,350,600,200,100,150,100,100])==1800":"assert sum([100,175,300,100,50,75,50,50])==900",
"assert 1800+650*3+300*3==4650":"assert 900+350*3+300*3==2850",
"assert 1800+650*12+300*12==13200":"assert 900+350*12+300*12==8700",
}
for a,b in changes.items():
    assert a in s,a
    s=s.replace(a,b)
amounts={'R$ 1.800,00':'R$ 900,00','R$ 650,00':'R$ 350,00','R$ 950,00':'R$ 650,00','R$ 1.950,00':'R$ 1.050,00','R$ 7.800,00':'R$ 4.200,00','R$ 2.750,00':'R$ 1.550,00','R$ 4.650,00':'R$ 2.850,00','R$ 13.200,00':'R$ 8.700,00','R$ 2.790,00':'R$ 1.590,00','R$ 4.690,00':'R$ 2.890,00','R$ 13.240,00':'R$ 8.740,00','R$ 150,00/mês':'R$ 100,00/mês'}
s=re.sub('|'.join(re.escape(x) for x in amounts),lambda m:amounts[m.group()],s)
extra='''
page(15,'Como usar: guia da clínica')
sub('1. Configurar os caminhos de entrada')
p('Na bio do Instagram: Editar perfil > Links > Adicionar link externo. Use o site institucional, com título "Conheça a clínica e os tratamentos". Para uma publicação de próteses, o link deve levar diretamente a /proteses.')
sub('2. Usar os destaques e stories')
p('Transfira as seis capas para a galeria do celular. Em cada destaque existente, pressione > Editar destaque > Editar capa > Galeria. Para criar um destaque, selecione primeiro um story publicado ou arquivado. Não é necessário publicar a capa separadamente.')
p('No story sobre próteses, adicione o adesivo Link com a landing /proteses e o texto "Solicitar avaliação". Salve o story em Próteses. Para prótese quebrada, solta ou desconfortável, use /urgencia-protese.')
sub('3. Testar o percurso antes de divulgar')
p('Abra o link no celular, confira a página, toque no botão e verifique se o WhatsApp mostra o número da clínica e a mensagem correta. A pessoa revisa e envia; o site não confirma consulta. Depois repita o teste usando o link da bio e do story.')
sub('4. Organizar o atendimento diário')
p('A recepção acompanha as mensagens durante o expediente, responde, verifica agenda e confirma o horário. Ao final do dia, registra apenas origem e resultado do contato. Se não houver disponibilidade, informar isso antes de aumentar os anúncios.')
sub('5. Usar e pagar os terceiros')
table(['Fornecedor','Como usar e pagar'],[
['Registro.br','A clínica registra o .com.br em seu CPF/CNPJ, paga R$ 40,00/ano na condição consultada e mantém o comprovante. A SoeiroTech configura o endereço; a taxa não é receita do prestador.'],
['Cloudflare','Hospedagem estática com custo previsto de R$ 0 no modelo atual. Não contratar plano pago sem necessidade e aprovação. Manutenção remunera trabalho, não uma taxa de hospedagem.'],
['Meta','Adicionar meio de pagamento da clínica na conta de anúncios. Aprovar R$ 300,00 para o piloto e conferir gastos/faturamento. A SoeiroTech recebe R$ 350,00 pelo pacote mensal; a Meta recebe a mídia.'],
['WhatsApp Business','Instalar no celular da clínica e organizar o perfil. Download gratuito; internet e linha pertencem à clínica. Não contratar API ou robô para esta etapa.'],
],[108,391])
p('Primeiro passo econômico: concluir o site e usar links orgânicos. Se os anúncios forem adiados, optar por manutenção de R$ 100,00/mês; não pagar também a gestão de R$ 350,00. Ao iniciar anúncios, trocar de plano por aceite escrito.','Small2')

'''
s=s.replace('def footer(c,doc):',extra+'def footer(c,doc):')
p.write_text(s,encoding='utf-8')
