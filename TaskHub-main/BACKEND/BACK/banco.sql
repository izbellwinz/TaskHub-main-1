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

SELECT DB_NAME() AS BancoAtual;
SELECT * FROM Usuario;
SELECT id, nome, email FROM Usuario;
SELECT id FROM Usuario;
SELECT email, dataCadastro FROM Usuario;