$ErrorActionPreference = 'Stop'
$taskSource = 'C:\dev\projects\ativos\clinica-odonto-personnallite'
$taskTarget = 'J:\Meu Drive\05_Trabalho_e_Projetos\Odonto Personnallite'
if (-not (Test-Path -LiteralPath $taskTarget -PathType Container)) { throw 'Pasta de destino indisponível.' }
$taskLog = [System.Collections.Generic.List[object]]::new()
function Save-Asset([string]$sourceFile, [string]$relativeTarget) {
    if (-not (Test-Path -LiteralPath $sourceFile -PathType Leaf)) { throw "Arquivo ausente: $sourceFile" }
    $destination = Join-Path $taskTarget $relativeTarget
    [System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($destination)) | Out-Null
    $sourceHash = (Get-FileHash -LiteralPath $sourceFile -Algorithm SHA256).Hash
    if (Test-Path -LiteralPath $destination) {
        if ((Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash -ne $sourceHash) {
            $stem = [System.IO.Path]::GetFileNameWithoutExtension($destination)
            $extension = [System.IO.Path]::GetExtension($destination)
            $parent = [System.IO.Path]::GetDirectoryName($destination)
            $destination = Join-Path $parent ($stem + '-2026-10-13-' + $sourceHash.Substring(0,8) + $extension)
        }
    }
    if (-not (Test-Path -LiteralPath $destination)) { Copy-Item -LiteralPath $sourceFile -Destination $destination }
    if ((Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash -ne $sourceHash) { throw "Falha na conferência: $destination" }
    $taskLog.Add([pscustomobject]@{Arquivo=$destination.Substring($taskTarget.Length+1);Origem=$sourceFile;SHA256=$sourceHash;Situacao='Cópia de trabalho - aprovação não registrada'})
}
function Save-Note([string]$relativeTarget, [string]$content) {
    $temporary = Join-Path $taskSource ('tmp\drive-note-' + [guid]::NewGuid().ToString() + '.txt')
    [System.IO.Directory]::CreateDirectory((Join-Path $taskSource 'tmp')) | Out-Null
    [System.IO.File]::WriteAllText($temporary,$content,[System.Text.UTF8Encoding]::new($true))
    Save-Asset $temporary $relativeTarget
    Remove-Item -LiteralPath $temporary
}
Save-Asset (Join-Path $taskSource 'output\pdf\projeto-comercial-odonto-personnallite.pdf') '01_Proposta_e_acordo\projeto-comercial-odonto-personnallite.pdf'
Save-Asset (Join-Path $taskSource 'output\apresentacao\apresentacao-odonto-personnallite.pptx') '01_Proposta_e_acordo\apresentacao-odonto-personnallite.pptx'
Save-Asset (Join-Path $taskSource 'output\pdf\projeto-assistente-recepcao-digital.pdf') '01_Proposta_e_acordo\Opcional_assistente\projeto-assistente-recepcao-digital.pdf'
Get-ChildItem -LiteralPath (Join-Path $taskSource 'public\images\brand') -File | ForEach-Object { Save-Asset $_.FullName ('02_Marca_e_materiais_originais\Logo_atual\' + $_.Name) }
Get-ChildItem -LiteralPath (Join-Path $taskSource 'output\kit-logo-atual') -File | ForEach-Object { Save-Asset $_.FullName ('02_Marca_e_materiais_originais\Kit_demonstrativo\' + $_.Name) }
Get-ChildItem -LiteralPath (Join-Path $taskSource 'output\capas-instagram') -File | ForEach-Object { Save-Asset $_.FullName ('04_Instagram\Capas_PNG\' + $_.Name) }
Get-ChildItem -LiteralPath (Join-Path $taskSource 'public\images\highlights') -File | ForEach-Object { Save-Asset $_.FullName ('04_Instagram\Capas_SVG\' + $_.Name) }
Get-ChildItem -LiteralPath (Join-Path $taskSource 'output\kit-logo-atual') -File | Where-Object { $_.Name -match '^(11|12|13|14|15)-' } | ForEach-Object { Save-Asset $_.FullName ('04_Instagram\Modelos_demonstrativos\' + $_.Name) }
Save-Note 'LEIA-PRIMEIRO.txt' @'
ODONTO PERSONNALLITE | ORGANIZAÇÃO DO PROJETO | 13/10/2026

01_Proposta_e_acordo: PDF comercial principal e PowerPoint para apresentação. A proposta apresenta cinco opções e recomenda a opção 04. O módulo de assistente é opcional e preliminar. Não há contrato assinado registrado aqui.
02_Marca_e_materiais_originais: cópias da logo usada no site e kit demonstrativo. Não presume recebimento dos arquivos originais da proprietária ou aprovação gráfica.
03_Site_e_landing_pages: links e documentação. Código-fonte permanece no projeto local e no versionamento; não foram copiados credenciais, dependências ou dados de pacientes.
04_Instagram: seis capas e modelos demonstrativos. Validar os dados antes de publicar. A organização desta pasta não altera a conta real do Instagram.
05_Anuncios: planejamento inicial; campanhas não ativadas.
06_Relatorios: modelo vazio para começar o acompanhamento; não há resultados reais preenchidos.
07_Entregas_aprovadas: reservada; inserir apenas arquivos com aprovação expressa registrada, indicando data e responsável.

Fluxo: A fazer > Em produção > Aguardando aprovação > Aprovado > Publicado.
Guardar a aprovação junto da entrega. Uma cópia no Drive não significa aprovação ou publicação.
Manter senhas em gerenciador próprio; não guardar senhas nestas pastas.
Contas, domínio e pagamentos da Meta devem ficar em nome da clínica.
Os arquivos foram copiados, sem mover os originais. Arquivos existentes diferentes recebem nova versão, sem sobrescrita.
O aplicativo Google Drive controla a sincronização; confirmar seu indicador antes de compartilhar.
'@
Save-Note '03_Site_e_landing_pages\LINKS-E-ESTADO.txt' @'
SITE E DEMONSTRAÇÕES | 13/10/2026
Site: https://clinica-sorriso.mandre-soeiro.workers.dev/
Próteses: https://clinica-sorriso.mandre-soeiro.workers.dev/proteses
Urgência em prótese: https://clinica-sorriso.mandre-soeiro.workers.dev/urgencia-protese
Urgência odontológica: https://clinica-sorriso.mandre-soeiro.workers.dev/urgencia-odontologica
Instagram demonstrativo: https://clinica-sorriso.mandre-soeiro.workers.dev/previa-instagram
Apresentação comercial: https://clinica-sorriso.mandre-soeiro.workers.dev/apresentacao-cliente
Apresentação animada: https://clinica-sorriso.mandre-soeiro.workers.dev/apresentacao-cliente#apresentacao-animada
Questionário: https://clinica-sorriso.mandre-soeiro.workers.dev/montar-proposta
Simulação do assistente: https://clinica-sorriso.mandre-soeiro.workers.dev/demonstracao-assistente

Stack atual: React + TypeScript + Vite, publicação Cloudflare.
Código local: C:\dev\projects\ativos\clinica-odonto-personnallite
As páginas comerciais acima são públicas; esconder links do menu não restringe acesso.
Fotos e dados precisam de validação. Assistente não conectado ao WhatsApp; formulário não confirma consulta. UTMs demonstrativas não equivalem a mensuração completa.
Próxima melhoria proposta, ainda não executada nesta organização: separar a navegação dos pacientes da apresentação comercial.
'@
Save-Note '04_Instagram\ORIENTACOES.txt' @'
CAPAS E MODELOS | PENDENTES DE VALIDAÇÃO
Seis destaques: Clínica, Equipe, Cuidados, Próteses, Atendimento e Localização.
Capas_PNG: imagens para aplicação; Capas_SVG: versões vetoriais correspondentes disponíveis no projeto.
Modelos_demonstrativos: posts, Stories e boas-vindas com a logo atual; não são publicações confirmadas.
Perfil configurado no site: https://www.instagram.com/odontopersonallite_/
Confirmar perfil com a dona antes de alterar ou divulgar. Bio final depende de dados reais e identificação profissional fornecida pela clínica.
Escopo mensal da opção 04: quatro posts estáticos/carrosséis de até cinco telas e até quatro adaptações de Stories. Filmagem e edição de Reels não incluídas.
'@
Save-Note '05_Anuncios\PLANO-INICIAL-PARA-APROVACAO.txt' @'
PLANO PRELIMINAR | ANÚNCIOS NÃO ATIVADOS
Referência comercial: opção 04 do PDF principal.
Uma campanha Meta; até duas peças/adaptações mensais; conferência semanal e relatório simples.
Gestão de anúncios: R$ 200/mês, dentro dos R$ 500/mês de serviços.
Mídia sugerida: R$ 300/mês pagos pela clínica diretamente à Meta. Não é promessa de resultado.
Não inclui Google Ads, três campanhas simultâneas ou verba de R$ 1.500. Ampliação exige escopo e aprovação próprios.

Antes de ativar:
1. Escolher tratamento e objetivo com a dona.
2. Confirmar região, horários e capacidade de atendimento.
3. Validar página, telefone e mensagem de contato.
4. Aprovar textos, artes e informações profissionais.
5. Liberar permissões e pagamento na conta da clínica.
6. Preparar identificação da origem e mensuração das ações.
7. Combinar retorno da recepção sobre conversas e agendamentos.
Não prometer atendimento imediato sem disponibilidade confirmada. Não inserir números de cases externos como previsão da clínica.
'@
Save-Note 'PENDENCIAS-DA-CLINICA.csv' @'
Item;Responsável sugerido;Situação;Observações
Escolha da proposta e extras;Clínica e prestador;A confirmar;Registrar aceite e condições
Nome oficial e grafia dos domínios;Clínica;A confirmar;Verificar antes de registrar
Telefone completo e WhatsApp;Clínica;A confirmar;Número fornecido tem oito dígitos locais, não acrescentar dígito automaticamente
Perfil correto do Instagram;Clínica;A confirmar;Conferir usuário e permissões
Endereço e horários;Clínica;Validar para lançamento;Conferir informações publicadas
Tratamentos e prioridade da campanha;Clínica;A confirmar;Validar disponibilidade
Fotos reais e autorizações;Clínica;Pendente;Substituir imagens ilustrativas
Equipe e informações profissionais;Clínica;Pendente;Fornecer dados aprovados
Conta Meta e pagamento de anúncios;Clínica;Pendente;Titularidade da clínica
Domínios e recuperação de conta;Clínica;Pendente;Disponibilidade e preços a conferir
Responsável pelo atendimento;Clínica;Pendente;Definir retorno de agendamentos
Separação do menu público e comercial;Prestador;Planejado;Ainda não executado nesta organização
Mensuração e identificação da origem;Prestador e clínica;Planejado;Validar ferramentas antes de ativar
'@
Save-Note '06_Relatorios\MODELO-MENSAL.csv' @'
Mes;Campanha;Mídia paga à plataforma;Gestão de anúncios;Visitas mensuradas;Cliques no WhatsApp;Conversas confirmadas pela recepção;Agendamentos confirmados;Comparecimentos;Fonte dos dados;Observações
'@
$inventory = Join-Path $taskSource 'tmp\inventario-drive-2026-10-13.csv'
$taskLog | Export-Csv -LiteralPath $inventory -NoTypeInformation -Encoding UTF8 -Delimiter ';'
Save-Asset $inventory 'INVENTARIO-2026-10-13.csv'
Write-Output ("Arquivos copiados ou conferidos: " + $taskLog.Count)
Get-ChildItem -LiteralPath $taskTarget -Directory | ForEach-Object { [pscustomobject]@{Pasta=$_.Name;Arquivos=(Get-ChildItem -LiteralPath $_.FullName -File -Recurse | Measure-Object).Count} } | Format-Table -AutoSize
