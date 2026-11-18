# Cópia protegida — preparação

Destino escolhido: Google Drive de odontopersonnallite.admin@gmail.com. Pasta criada e acesso Restrito verificado em 23/10/2026; somente a conta da clínica aparece como proprietária.

Pasta: https://drive.google.com/drive/u/2/folders/1jZR-YkvZxjOq891iJnjyw36-XdDomz2H

Estado: **não ativado, não publicado e sem exportação de dados reais**. A conexão pelo navegador foi restabelecida. O conector Drive disponível usa outra conta; a integração persistente da clínica continua pendente.

O código cifra uma cópia consistente das nove tabelas com AES-256-GCM e compressão. Antes de ler o banco, verifica a conta Google e exige pasta privada pertencente a ela. Recusa cópia truncada, chave ausente ou destino compartilhado. A recuperação verifica integridade e cria somente banco local novo fora do projeto; nunca restaura produção automaticamente.

Rotina preparada: diária às 03:00 de Fortaleza/Belém (06:00 UTC), com janela de 30 dias. O exemplo Wrangler permanece desativado e sem agendamento ativo. As cópias antigas marcadas pela integração na pasta escolhida são movidas para a lixeira somente após baixar, decifrar e comparar a cópia nova. Arquivos de outras origens não são tocados. A lixeira não é esvaziada por esta rotina e segue as regras do Drive.

Renovação de acesso implementada com DRIVE_CLIENT_ID, DRIVE_CLIENT_SECRET e DRIVE_REFRESH_TOKEN. A autorização OAuth real ainda precisa ser criada/concedida na conta da clínica; nenhum token foi obtido. Verificar duração da autorização e escopos antes da ativação. Um aplicativo com escopo drive.file precisa ter acesso autorizado à pasta (por seleção autorizada ou criação por esse aplicativo); abrir a pasta no navegador não concede isso. O token temporário opcional DRIVE_ACCESS_TOKEN não serve como solução recorrente.

Antes de ativar: responsável da clínica guarda BACKUP_KEY (32 bytes aleatórios) em gerenciador de senhas e uma cópia de recuperação separada, fora do Drive e do repositório. Inserir somente nos segredos do Worker. Não enviar a chave pelo chat. Autorizar a integração persistente, verificar acesso à pasta, executar a primeira cópia e testar a recuperação antes de habilitar cron e retenção. Preparação não equivale a backup operacional.

Validação sintética: executar `node scripts/test-protected-backup.mjs`. Verificação de arquivo autorizado: `node scripts/restore-protected-backup.mjs --check arquivo.odonto.enc`, com ODONTO_BACKUP_KEY no ambiente privado.

O Time Travel D1 de sete dias é independente desta cópia externa. Nenhuma garantia de recuperação externa existe até configurar, executar e verificar a primeira cópia autorizada.
