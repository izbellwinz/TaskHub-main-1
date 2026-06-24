package com.itb.inf2am.divulgai.model.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "Tarefa")
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "agenda_id", nullable = false)
    private Long agendaId;

    @Column(name = "dataCadastro", nullable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "dataVencimento", nullable = true)
    private LocalDateTime dataVencimento;

    @Column(name = "antecedenciaNotificacao", nullable = true)
    private Integer antecedenciaNotificacao;

    @Column(name = "descricao", length = 200, nullable = true)
    private String descricao;

    @Column(name = "statusTarefa", length = 20, nullable = false)
    private String statusTarefa;

    @Column(name = "cor", length = 20, nullable = true)
    private String cor;

    @Column(name = "arquivo", nullable = true)
    @Lob
    private byte[] arquivo;

    @PrePersist
    protected void onCreate() {
        this.dataCadastro = LocalDateTime.now();
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAgendaId() {
        return agendaId;
    }

    public void setAgendaId(Long agendaId) {
        this.agendaId = agendaId;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public LocalDateTime getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDateTime dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public Integer getAntecedenciaNotificacao() {
        return antecedenciaNotificacao;
    }

    public void setAntecedenciaNotificacao(Integer antecedenciaNotificacao) {
        this.antecedenciaNotificacao = antecedenciaNotificacao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getStatusTarefa() {
        return statusTarefa;
    }

    public void setStatusTarefa(String statusTarefa) {
        this.statusTarefa = statusTarefa;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public byte[] getArquivo() {
        return arquivo;
    }

    public void setArquivo(byte[] arquivo) {
        this.arquivo = arquivo;
    }
}
