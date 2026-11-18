# Integração local do site com o painel
13/10/2026.

A versão conectada fica em http://127.0.0.1:8001/contato. O site publicado na Cloudflare não foi alterado nesta etapa e continua com o fluxo de WhatsApp.

## Fluxo
Visitante usa dados fictícios -> confirma que deseja retorno -> envia -> Django valida -> PostgreSQL grava contato Novo -> recepção autorizada consulta /admin/leads/lead/.
O envio não agenda consulta, não envia WhatsApp automaticamente e não publica dados de contato. Apenas nome, telefone, origem/código de campanha e identificador aleatório do pedido são enviados.
Não há campo de mensagem livre, diagnóstico, exame ou prontuário nesse formulário conectado. A alternativa WhatsApp continua disponível.

## Controles
- Mesma origem para site e API; proteção CSRF.
- API pública permite apenas envio e não lista ou devolve os dados cadastrados.
- Identificador de tentativa evita repetir a gravação em um reenvio inalterado.
- Validação de campos e bloqueio de campos adicionais.
- Limite local de 8 tentativas por 10 minutos por chave técnica em memória de cada processo; não é uma proteção distribuída de produção.
- Campo antiautomação no protocolo. Não equivale a CAPTCHA.
- A captura só funciona com DEBUG e CONTACT_INTAKE_ENABLED. Em produção ela fica desativada até preparar infraestrutura, controles de abuso e documentação real.

## Compilar a demonstração (WSL)
VITE_CONTACT_API_ENABLED=true npm run build -- --outDir dist-local
Copiar dist-local/ para backend/frontend/ e reconstruir com Docker Compose.
O diretório dist/ normal não foi substituído. Não publicar dist-local/ ou a imagem de desenvolvimento como ambiente oficial.

Antes de ligar ao endereço público: hospedar a API, configurar domínio e HTTPS/origens, proteção distribuída contra abuso, dados reais da clínica, responsável, retenção e atendimento. Nenhum serviço pago foi contratado.
