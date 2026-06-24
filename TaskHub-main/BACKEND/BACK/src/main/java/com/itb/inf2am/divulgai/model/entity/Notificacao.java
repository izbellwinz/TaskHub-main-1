package com.itb.inf2am.divulgai.model.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "Notificacao")
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "tarefa_id", nullable = false)
    private Long tarefaId;

    @Column(name = "mensagem", length = 200, nullable = true)
    private String mensagem;

    @Column(name = "dataEnvio", nullable = false)
    private LocalDateTime dataEnvio;

    @Column(name = "lida", nullable = false)
    private Boolean lida = false;

    @Column(name = "statusNotificacao", length = 20, nullable = false)
    private String statusNotificacao = "pendente";

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getTarefaId() {
        return tarefaId;
    }

    public void setTarefaId(Long tarefaId) {
        this.tarefaId = tarefaId;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }

    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }

    public Boolean getLida() {
        return lida;
    }

    public void setLida(Boolean lida) {
        this.lida = lida;
    }

    public String getStatusNotificacao() {
        return statusNotificacao;
    }

    public void setStatusNotificacao(String statusNotificacao) {
        this.statusNotificacao = statusNotificacao;
    }
}
