-- ===========================================
-- SCRIPT TASKHUB
-- ===========================================
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'Taskhub')

DROP DATABASE Taskhub;
GO

CREATE DATABASE Taskhub;
GO


USE Taskhub;

GO
-- ==========================
--          TABELAS
-- ==========================

-- ==========================
-- DROPAR TABELAS NA ORDEM CORRETA
-- ==========================
IF OBJECT_ID('Notificacao', 'U') IS NOT NULL DROP TABLE Notificacao;
IF OBJECT_ID('Configuracao', 'U') IS NOT NULL DROP TABLE Configuracao;
IF OBJECT_ID('Contato', 'U') IS NOT NULL DROP TABLE Contato;
IF OBJECT_ID('Tarefa', 'U') IS NOT NULL DROP TABLE Tarefa;
IF OBJECT_ID('Agenda', 'U') IS NOT NULL DROP TABLE Agenda;
IF OBJECT_ID('Usuario', 'U') IS NOT NULL DROP TABLE Usuario;
GO

-- ==========================
-- TABELA USUARIO
-- ==========================
CREATE TABLE Usuario
(
 id INT IDENTITY(1,1) PRIMARY KEY,
 nome VARCHAR(100) NOT NULL,
 email VARCHAR(150) UNIQUE NOT NULL,
 senha VARCHAR(255) NOT NULL,
 nivelAcesso VARCHAR(20) NULL, 
 foto VARBINARY(MAX) NULL,
 dataCadastro SMALLDATETIME NOT NULL DEFAULT GETDATE(),
 dataAtualizacao SMALLDATETIME NULL,
 statusUsuario VARCHAR(20) NOT NULL
);
GO

-- ==========================
-- TABELA AGENDA
-- ==========================
CREATE TABLE Agenda
(
 id INT IDENTITY(1,1) PRIMARY KEY,
 usuario_id INT NOT NULL,
 dataAgenda DATE NOT NULL,
 hora TIME NOT NULL, 
 dataCadastro SMALLDATETIME NOT NULL DEFAULT GETDATE(),
 titulo VARCHAR(100) NOT NULL,
 descricao VARCHAR(200) NULL,
 arquivo VARBINARY(MAX) NULL,
	 statusAgenda VARCHAR(20) NOT NULL,
	 cor VARCHAR(20) NULL,
	 notificar BIT NOT NULL DEFAULT 1,
	 antecedenciaNotificacao INT NOT NULL DEFAULT 30,
	 googleEventId VARCHAR(255) NULL,
	 sincronizadoGoogle BIT NOT NULL DEFAULT 0,
	
	 CONSTRAINT FK_Agenda_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
	);
GO

-- ==========================
-- TABELA TAREFA
-- ==========================
CREATE TABLE Tarefa
(
 id INT IDENTITY(1,1) PRIMARY KEY,
 agenda_id INT NOT NULL,
 dataCadastro SMALLDATETIME NOT NULL DEFAULT GETDATE(),
 dataVencimento SMALLDATETIME NULL, 
 antecedenciaNotificacao INT NULL,
 descricao VARCHAR(200) NULL,
 statusTarefa VARCHAR(20) NOT NULL,
 cor VARCHAR(20) NULL,
 arquivo VARBINARY(MAX) NULL,

 CONSTRAINT FK_Tarefa_Agenda FOREIGN KEY (agenda_id) REFERENCES Agenda(id)
);
GO

-- ==========================
-- TABELA CONTATO
-- ==========================
CREATE TABLE Contato
(
 id INT IDENTITY(1,1) PRIMARY KEY,
 usuario_id INT NOT NULL,
 nome VARCHAR(100) NOT NULL,
 email VARCHAR(100) NOT NULL,
 assunto VARCHAR(100) NOT NULL,
 dataEnvio SMALLDATETIME NOT NULL DEFAULT GETDATE(),

 CONSTRAINT FK_Contato_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);
GO

-- ==========================
-- TABELA CONFIGURACAO
-- ==========================
CREATE TABLE Configuracao
(
 id INT IDENTITY(1,1) PRIMARY KEY,
 usuario_id INT NOT NULL,
 primeiroDiaSemana VARCHAR(15) NULL,
 formatoHora VARCHAR(10) NOT NULL,
 tema VARCHAR(20) NULL,
-- Campos de privacidade
 mostrarEmail BIT NOT NULL DEFAULT 0, -- 0 = não mostrar, 1 = mostrar
 receberEmail BIT NOT NULL DEFAULT 1, -- 1 = receber emails, 0 = não receber

 CONSTRAINT FK_Config_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);
GO

-- ==========================
-- TABELA NOTIFICACAO
-- ==========================
CREATE TABLE Notificacao
(
 id INT IDENTITY(1,1) PRIMARY KEY,
 usuario_id INT NOT NULL,
 tarefa_id INT NOT NULL,
 mensagem VARCHAR(200) NULL,
 dataEnvio SMALLDATETIME NOT NULL,
 lida BIT NOT NULL DEFAULT 0,
 statusNotificacao VARCHAR(20) NOT NULL CHECK (statusNotificacao IN ('pendente', 'enviada')),


 CONSTRAINT FK_Notificacao_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
 CONSTRAINT FK_Notificacao_Tarefa FOREIGN KEY (tarefa_id) REFERENCES Tarefa(id)
);
GO

INSERT INTO Usuario (nome, email, senha, nivelAcesso, statusUsuario)
VALUES ('Izabelle Winz', 'izabelle@example.com', '123456', 'admin', 'ativo');

INSERT INTO Usuario (nome, email, senha, nivelAcesso, statusUsuario)
VALUES ('Thanos Santos', 'thanossantos@example.com', '17H98d', 'admin', 'ativo');

INSERT INTO Usuario (nome, email, senha, nivelAcesso, statusUsuario)
VALUES ('Maria Oliveira', 'maria.oliveira@example.com', 'senha123', 'usuario', 'ativo');

INSERT INTO Usuario (nome, email, senha, nivelAcesso, statusUsuario)
VALUES ('Carlos Souza', 'carlos.souza@example.com', 'abc456', 'usuario', 'ativo');

INSERT INTO Usuario (nome, email, senha, nivelAcesso, statusUsuario)
VALUES ('Ana Costa', 'ana.costa@example.com', 'pass789', 'usuario', 'ativo');

--SELECTS NOVOS

-- Verificar em qual banco você está
SELECT DB_NAME() AS BancoAtual;
GO

-- Listar todos os usuários cadastrados
SELECT
    id,
    nome,
    email,
    nivelAcesso,
    statusUsuario,
    dataCadastro,
    dataAtualizacao
FROM Usuario
ORDER BY id;
GO

-- Verificar somente usuários ativos
SELECT
    id,
    nome,
    email,
    nivelAcesso,
    statusUsuario
FROM Usuario
WHERE statusUsuario = 'ativo'
ORDER BY nome;
GO

-- Verificar quantidade de usuários cadastrados
SELECT
    COUNT(*) AS TotalUsuarios
FROM Usuario;
GO

-- Listar agendas com o nome do usuário
SELECT
    A.id AS agendaId,
    U.nome AS usuario,
    U.email,
    A.titulo,
    A.descricao,
    A.dataAgenda,
    A.hora,
    A.statusAgenda,
    A.cor
FROM Agenda A
INNER JOIN Usuario U ON A.usuario_id = U.id
ORDER BY A.dataAgenda, A.hora;
GO

-- Listar tarefas com agenda e usuário
SELECT
    T.id AS tarefaId,
    U.nome AS usuario,
    A.titulo AS agenda,
    T.descricao AS tarefa,
    T.dataVencimento,
    T.antecedenciaNotificacao,
    T.statusTarefa,
    T.cor
FROM Tarefa T
INNER JOIN Agenda A ON T.agenda_id = A.id
INNER JOIN Usuario U ON A.usuario_id = U.id
ORDER BY T.dataVencimento;
GO

-- Listar configurações dos usuários
SELECT
    C.id AS configuracaoId,
    U.nome AS usuario,
    U.email,
    C.primeiroDiaSemana,
    C.formatoHora,
    C.tema,
    C.mostrarEmail,
    C.receberEmail
FROM Configuracao C
INNER JOIN Usuario U ON C.usuario_id = U.id
ORDER BY U.nome;
GO

-- Listar notificações com usuário e tarefa
SELECT
    N.id AS notificacaoId,
    U.nome AS usuario,
    T.descricao AS tarefa,
    N.mensagem,
    N.dataEnvio,
    N.lida,
    N.statusNotificacao
FROM Notificacao N
INNER JOIN Usuario U ON N.usuario_id = U.id
INNER JOIN Tarefa T ON N.tarefa_id = T.id
ORDER BY N.dataEnvio DESC;
GO

-- Listar contatos enviados pelos usuários
SELECT
    C.id AS contatoId,
    U.nome AS usuario,
    C.nome AS nomeContato,
    C.email AS emailContato,
    C.assunto,
    C.dataEnvio
FROM Contato C
INNER JOIN Usuario U ON C.usuario_id = U.id
ORDER BY C.dataEnvio DESC;
GO

---------------------
