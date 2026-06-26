# TaskHub - Contexto do Projeto Web e Backend

Este documento resume o projeto TaskHub para consulta futura e para uso como contexto em prompts no ChatGPT. A parte mobile deve ser ignorada neste contexto.

## Escopo

O projeto tem dois blocos principais:

- Frontend web: `taskhub`
- Backend: `BACKEND/BACK`

Ignorar:

- `TaskHub-MobileV2.9`
- `node_modules`
- `dist`

## Frontend Web

O frontend fica em `TaskHub-main/taskhub`.

Stack principal:

- React 19
- Vite 7
- Axios
- Bootstrap
- React DOM

Scripts disponiveis:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Arquivo principal:

- `src/App.jsx`

O app nao usa React Router formalmente. A navegacao e feita por estado interno `currentPage`, e algumas telas tambem navegam usando `?page=` na URL.

Paginas principais:

- `Home.jsx`: landing page do TaskHub, com apresentacao, recursos e chamadas para cadastro/login.
- `Login.jsx`: login por email/senha e fluxo de recuperacao/reset de senha.
- `Cadastro.jsx`: cadastro de usuario com nome, sobrenome, email, senha e aceite de termos.
- `Dashboard.jsx`: tela principal apos login, mostra eventos do dia, proxima tarefa, notificacoes, configuracoes e alternancia de tema.
- `Agenda.jsx`: calendario mensal com CRUD de eventos, checklist, cores, anexos de imagem e menu de contexto.
- `Perfil.jsx`: edicao de dados pessoais, foto de perfil e redefinicao de senha.
- `Sobre.jsx`: pagina institucional com recursos e diferenciais.
- `Footer.jsx` e `Navbar.jsx`: componentes compartilhados.

Tema:

- O tema claro/escuro e controlado por `darkTheme`.
- A preferencia e salva no `localStorage` com a chave `taskhub-theme`.

## Comunicacao HTTP

Arquivo:

- `src/common/http-common.js`

O frontend usa Axios com:

- `baseURL = import.meta.env.VITE_API_URL || protocolo + hostname + :8080`
- `withCredentials: true`
- `Content-Type: application/json`

Tambem existem instancias para multipart e para a API ViaCEP.

Services do frontend:

- `UsuarioService.js`
- `AgendaService.js`
- `TarefaService.js`
- `NotificacaoService.js`
- `ConfiguracaoService.js`

## Backend

O backend fica em `TaskHub-main/BACKEND/BACK`.

Stack principal:

- Java 17
- Spring Boot 3.5.3
- Spring Web
- Spring Data JPA
- Spring Security
- Spring Mail
- SQL Server JDBC

Arquivo principal:

- `src/main/java/com/itb/inf2am/divulgai/TaskHub.java`

Configuracao:

- `src/main/resources/application.properties`

Configuracoes importantes:

- Porta: `8080`
- Banco: SQL Server local
- Database: `Taskhub`
- `spring.jpa.hibernate.ddl-auto=none`
- `spring.jpa.generate-ddl=false`

## Seguranca e CORS

Arquivos:

- `SecurityConfig.java`
- `CorsConfig.java`

Configuracao de seguranca:

- CSRF desabilitado.
- CORS habilitado.
- Rotas `/api/v1/**` publicas.
- Login form desabilitado.
- O login real e feito por endpoint REST em `/api/v1/usuarios/login`.
- Senhas usam `BCryptPasswordEncoder`.

CORS:

- Permite `localhost`, `127.0.0.1` e redes locais.
- Permite metodos `GET`, `POST`, `PUT`, `DELETE` e `OPTIONS`.
- Permite credentials.

## Endpoints Principais

Usuarios: `/api/v1/usuarios`

- `GET /api/v1/usuarios`
- `GET /api/v1/usuarios/{id}`
- `POST /api/v1/usuarios`
- `POST /api/v1/usuarios/login`
- `PUT /api/v1/usuarios/{id}`
- `PUT /api/v1/usuarios/inativar/{id}`
- `PUT /api/v1/usuarios/reativar/{id}`
- `PUT /api/v1/usuarios/alterarSenha/{id}?senha=...`
- `POST /api/v1/usuarios/resetSenha`

Agendas: `/api/v1/agendas`

- CRUD completo.
- Busca por usuario: `GET /api/v1/agendas/usuario/{usuarioId}`

Tarefas/checklist: `/api/v1/tarefas`

- CRUD completo.
- Busca por agenda: `GET /api/v1/tarefas/agenda/{agendaId}`

Notificacoes: `/api/v1/notificacoes`

- CRUD completo.
- Busca por usuario: `GET /api/v1/notificacoes/usuario/{usuarioId}`

Configuracoes: `/api/v1/configuracoes`

- CRUD completo.
- Busca por usuario: `GET /api/v1/configuracoes/usuario/{usuarioId}`

Contatos: `/api/v1/contatos`

- Existe no backend, mas nao parece ter service web equivalente no frontend atual.

## Entidades Principais

`Usuario`

- Campos: `id`, `nome`, `username`, `password`, `dataCadastro`, `dataAtualizacao`, `nivelAcesso`, `foto`, `statusUsuario`.
- `username` representa o email.
- `statusUsuario` padrao: `ATIVO`.
- `nivelAcesso` padrao no service: `USER`.

`Agenda`

- Campos: `id`, `usuarioId`, `dataAgenda`, `hora`, `dataCadastro`, `titulo`, `descricao`, `arquivo`, `statusAgenda`, `cor`.
- Usada como evento do calendario.

`Tarefa`

- Campos: `id`, `agendaId`, `dataCadastro`, `dataVencimento`, `antecedenciaNotificacao`, `descricao`, `statusTarefa`, `cor`, `arquivo`.
- No frontend, e usada como item de checklist de uma agenda.

`Notificacao`

- Campos: `id`, `usuarioId`, `tarefaId`, `mensagem`, `dataEnvio`, `lida`, `statusNotificacao`.

`Configuracao`

- Campos: `id`, `usuarioId`, `primeiroDiaSemana`, `formatoHora`, `tema`, `mostrarEmail`, `receberEmail`.

`Contato`

- Campos: `id`, `usuarioId`, `nome`, `email`, `assunto`, `dataEnvio`.

## Fluxos Importantes

Cadastro:

- O frontend envia `nome`, `email` e `senha`.
- O backend salva o usuario com senha criptografada.
- Apos cadastrar, o frontend faz login automaticamente e salva o usuario no `localStorage`.

Login:

- O frontend chama `/api/v1/usuarios/login`.
- O backend aceita `email/senha` ou `username/password`.
- Retorna dados publicos do usuario, sem password.
- O frontend salva o usuario no `localStorage` com a chave `user`.

Dashboard:

- Le o usuario do `localStorage`.
- Busca agendas, notificacoes e configuracoes pelo `user.id`.
- Mostra eventos de hoje e o proximo evento/tarefa.

Agenda:

- Busca agendas do usuario.
- Para cada agenda, busca tarefas por `agendaId`.
- Mapeia tarefas como checklist.
- Criar/editar evento salva em `Agenda`.
- Checklist salva em `Tarefa`.
- Anexos de imagem sao enviados como base64.

Perfil:

- Le o usuario do `localStorage`.
- Permite alterar nome, email, foto e senha.
- Foto pode ser salva como data URL/base64.

Configuracoes:

- Tema claro/escuro fica no frontend e pode ser persistido tambem em `Configuracao`.
- `receberEmail` e usado como preferencia de notificacao/email.

## Observacoes Tecnicas

- Ha alguns textos com problema de encoding no codigo, por exemplo `PÃ¡gina`, `NotificaÃ§Ãµes` e similares.
- Ha duplicidade de controllers de usuario:
  - `UsuarioController` em `/api/v1/usuarios`, usado pelo frontend.
  - `UsuariosController` em `/usuarios`, aparentemente legado ou alternativo.
- O frontend mistura navegacao por `setCurrentPage(...)` com `window.location.href = '/?page=...'`.
- Nao considerar nenhuma implementacao mobile neste contexto.

## Alteracoes Recentes

Foram implementadas duas melhorias apenas no site web:

- Notificacoes visuais no dashboard, no canto inferior direito da tela.
- Base opcional de integracao com Google Agenda na tela de agenda.

Arquivos principais alterados:

- `taskhub/src/pages/Dashboard.jsx`
- `taskhub/src/pages/Dashboard.css`
- `taskhub/src/pages/Agenda.jsx`
- `taskhub/src/pages/Agenda.css`
- `taskhub/src/services/GoogleCalendarService.js`
- `README.md`

## Notificacoes Visuais

A tela `Dashboard.jsx` agora:

- Carrega agendas do usuario.
- Carrega tarefas vinculadas a cada agenda.
- Verifica periodicamente eventos e tarefas proximos do horario/data de vencimento.
- Exibe cards de notificacao no canto inferior direito, em estilo parecido com notificacoes de apps de reuniao.
- Evita notificacoes duplicadas usando `localStorage`.
- Permite fechar cada card.
- Permite marcar notificacoes persistidas no backend como lidas.
- Respeita tema claro/escuro.

Preferencias usadas:

- `Configuracao.receberEmail`: usado como preferencia existente para ativar/desativar notificacoes no site.
- `Tarefa.antecedenciaNotificacao`: usado quando a tarefa tiver antecedencia propria.
- `taskhub-notification-lead-minutes`: chave local no navegador para guardar o padrao de antecedencia dos eventos.
- `taskhub-dismissed-notifications`: chave local para evitar cards duplicados ja fechados.

Limite de antecedencia:

- O usuario pode escolher de `0` a `60` minutos.
- Valores fora do intervalo sao limitados automaticamente.

Observacao:

- Nao foi criado campo novo no banco para notificacoes visuais.
- Como `Configuracao` ja tinha `receberEmail` e `Tarefa` ja tinha `antecedenciaNotificacao`, a implementacao aproveitou o schema atual.

## Google Agenda

Foi criada uma base opcional no frontend para conectar e sincronizar eventos com Google Agenda.

Arquivo:

- `taskhub/src/services/GoogleCalendarService.js`

Comportamento:

- A tela `Agenda.jsx` continua funcionando normalmente sem Google.
- Se `VITE_GOOGLE_CLIENT_ID` nao estiver configurado, o botao mostra uma mensagem informando que falta configuracao.
- Se `VITE_GOOGLE_CLIENT_ID` estiver configurado, o usuario pode iniciar o fluxo de autorizacao Google.
- Depois de conectado, o botao tenta sincronizar os eventos ativos do TaskHub com o calendario principal do Google.

Variaveis de ambiente:

```properties
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_REDIRECT_URI=
```

`VITE_GOOGLE_REDIRECT_URI` e opcional. Se nao for definida, o frontend usa a URL atual da tela.

Limitacoes da integracao Google:

- Esta e uma base segura e opcional no frontend.
- Nao foi adicionada dependencia Google no backend.
- Nao foram colocadas chaves secretas no codigo.
- Para producao, o ideal e evoluir para OAuth com PKCE ou fluxo intermediado pelo backend.

## Banco de Dados e SQL

Nenhum script SQL novo foi necessario nesta etapa.

O arquivo existente continua sendo:

- `BACKEND/BACK/banco.sql`

Como `spring.jpa.hibernate.ddl-auto=none`, qualquer mudanca futura de tabela deve ser feita por SQL manual e documentada aqui.

Nesta implementacao:

- Nenhuma tabela foi criada.
- Nenhuma coluna foi adicionada.
- Nenhum dado existente deve ser apagado.

## Como Rodar

Backend:

```bash
cd TaskHub-main/BACKEND/BACK
mvn spring-boot:run
```

O backend deve iniciar na porta `8080`.

Frontend:

```bash
cd TaskHub-main/taskhub
npm install
npm run dev
```

Build do frontend:

```bash
npm run build
```

Lint do frontend:

```bash
npm run lint
```

## Como Testar Notificacoes

1. Inicie backend e frontend.
2. Faca login no site.
3. Abra o Dashboard.
4. Entre nas configuracoes.
5. Ative `Receber notificacoes`.
6. Defina `Avisar antes` com valor entre `0` e `60` minutos.
7. Crie um evento na Agenda com horario dentro da janela escolhida.
8. Volte ao Dashboard.
9. O card de notificacao deve aparecer no canto inferior direito.

Para testar tarefas:

1. A tarefa precisa ter `dataVencimento` preenchida no banco/API.
2. Se `antecedenciaNotificacao` existir, ela tem prioridade para aquela tarefa.
3. O limite maximo continua sendo `60` minutos.

## Como Testar Google Agenda

Sem credenciais:

1. Abra a tela Agenda.
2. Clique em `Conectar Google`.
3. O sistema deve informar que falta configurar `VITE_GOOGLE_CLIENT_ID`.
4. O calendario do TaskHub deve continuar funcionando normalmente.

Com credenciais:

1. Configure `VITE_GOOGLE_CLIENT_ID`.
2. Opcionalmente configure `VITE_GOOGLE_REDIRECT_URI`.
3. Reinicie o frontend.
4. Abra a tela Agenda.
5. Clique em `Conectar Google`.
6. Autorize o acesso no Google.
7. Volte para a Agenda.
8. Clique em `Sincronizar Google`.

Resultado esperado:

- Eventos ativos do TaskHub sao enviados para o calendario principal do Google.
- Se a API recusar o token ou a configuracao estiver incompleta, o erro aparece na tela sem quebrar a agenda local.

## Atualizacao - Notificacoes da Agenda

Implementado na Agenda web:

- Campo `Quero ser avisado sobre este evento` no formulario de criar/editar evento.
- Campo `Avisar com antecedencia` com opcoes `0`, `5`, `10`, `15`, `30`, `45` e `60` minutos.
- Validacao no frontend e backend para limitar a antecedencia entre `0` e `60`.
- Toast visual reutilizavel no canto inferior direito, inspirado em notificacoes do Microsoft Teams.
- Verificacao automatica no frontend a cada 30 segundos.
- Deduplicacao por sessao com `Set` em memoria e `sessionStorage`.
- Status de notificacao e Google Agenda no detalhe do evento.
- Estrutura inicial de OAuth Google Calendar no backend, sem segredo no frontend.

Arquivos alterados/criados:

- `taskhub/src/pages/Agenda.jsx`
- `taskhub/src/pages/Agenda.css`
- `taskhub/src/components/NotificationToast.jsx`
- `taskhub/src/components/NotificationToast.css`
- `taskhub/src/services/GoogleCalendarService.js`
- `BACKEND/BACK/src/main/java/com/itb/inf2am/divulgai/model/entity/Agenda.java`
- `BACKEND/BACK/src/main/java/com/itb/inf2am/divulgai/services/AgendaService.java`
- `BACKEND/BACK/src/main/java/com/itb/inf2am/divulgai/controller/AgendaController.java`
- `BACKEND/BACK/src/main/java/com/itb/inf2am/divulgai/controller/GoogleCalendarController.java`
- `BACKEND/BACK/src/main/java/com/itb/inf2am/divulgai/services/GoogleCalendarService.java`
- `BACKEND/BACK/src/main/java/com/itb/inf2am/divulgai/services/GoogleOAuthService.java`
- `BACKEND/BACK/src/main/resources/application.properties`
- `BACKEND/BACK/banco.sql`
- `README.md`

Campos adicionados em `Agenda`:

```sql
notificar BIT NOT NULL DEFAULT 1
antecedenciaNotificacao INT NOT NULL DEFAULT 30
googleEventId VARCHAR(255) NULL
sincronizadoGoogle BIT NOT NULL DEFAULT 0
```

Script SQL:

- Para banco novo, o `CREATE TABLE Agenda` em `BACKEND/BACK/banco.sql` ja contem os novos campos.
- Para banco existente, execute apenas o bloco `MIGRACAO SEGURA - NOTIFICACOES DA AGENDA` no final de `BACKEND/BACK/banco.sql`.
- Esse bloco usa `COL_LENGTH` e `ALTER TABLE ... ADD`; ele nao apaga tabelas nem dados.
- Nao execute os `DROP` do inicio do arquivo em banco com dados reais.

Como testar notificacoes na Agenda:

1. Execute a migracao segura no banco existente.
2. Inicie backend e frontend.
3. Faca login e abra `Agenda`.
4. Crie um evento com data/hora proximas.
5. Marque `Quero ser avisado sobre este evento`.
6. Escolha a antecedencia, por exemplo `5 minutos antes`.
7. Aguarde a verificacao automatica; o toast aparece no canto inferior direito.
8. Feche ou marque como lida; o mesmo evento nao deve repetir na mesma sessao.

Como testar notificacao desativada:

1. Crie ou edite um evento.
2. Desmarque `Quero ser avisado sobre este evento`.
3. Salve.
4. Mesmo dentro da janela de horario, nenhum toast deve aparecer para esse evento.

Como testar o limite de 1 hora:

1. Pela interface, confirme que a maior opcao e `60 minutos antes`.
2. Pela API, tente enviar `antecedenciaNotificacao` maior que `60`.
3. O backend normaliza para `60`.
4. Valores menores que `0` sao normalizados para `0`.

Google Agenda:

- Endpoints criados:
  - `GET /api/v1/google-calendar/auth-url`
  - `GET /api/v1/google-calendar/callback`
  - `POST /api/v1/google-calendar/sync-agenda/{agendaId}`
  - `DELETE /api/v1/google-calendar/event/{agendaId}`
  - `GET /api/v1/google-calendar/status/{usuarioId}`
- Variaveis opcionais no backend:

```properties
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

Limitacao conhecida:

- A estrutura de OAuth e endpoints foi criada, mas a troca de `code` por token, persistencia segura de token e chamada real para criar/atualizar evento no Google Calendar ainda nao foram implementadas.
- A Agenda funciona normalmente sem Google Agenda.
- As notificacoes no celular dependem da sincronizacao com Google Agenda e das permissoes de notificacao do app Google Agenda no celular do usuario.

Comandos executados:

```bash
npm run build
.\mvnw.cmd -DskipTests package
.\mvnw.cmd spring-boot:run
.\mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

Observacoes dos testes:

- `npm run build` passou.
- `.\mvnw.cmd -DskipTests package` passou.
- `.\mvnw.cmd spring-boot:run` carregou o contexto e conectou ao SQL Server, mas falhou porque a porta `8080` ja estava em uso.
- Rodando em `8081`, o backend iniciou com `Started TaskHub`; o processo de teste foi encerrado depois.
