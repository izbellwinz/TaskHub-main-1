package com.itb.inf2am.divulgai.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import jakarta.persistence.*;

@Entity
@Table(name = "Agenda")
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "dataAgenda", nullable = false)
    private LocalDate dataAgenda;

    @Column(name = "hora", nullable = false)
    private LocalTime hora;

    @Column(name = "dataCadastro", nullable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "titulo", length = 100, nullable = false)
    private String titulo;

    @Column(name = "descricao", length = 200, nullable = true)
    private String descricao;

    @Column(name = "arquivo", nullable = true)
    @Lob
    private byte[] arquivo;

    @Column(name = "statusAgenda", length = 20, nullable = false)
    private String statusAgenda;

    @Column(name = "cor", length = 20, nullable = true)
    private String cor;

    @Column(name = "notificar", nullable = false)
    private Boolean notificar = true;

    @Column(name = "antecedenciaNotificacao", nullable = false)
    private Integer antecedenciaNotificacao = 30;

    @Column(name = "googleEventId", length = 255, nullable = true)
    private String googleEventId;

    @Column(name = "sincronizadoGoogle", nullable = false)
    private Boolean sincronizadoGoogle = false;

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

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public LocalDate getDataAgenda() {
        return dataAgenda;
    }

    public void setDataAgenda(LocalDate dataAgenda) {
        this.dataAgenda = dataAgenda;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public byte[] getArquivo() {
        return arquivo;
    }

    public void setArquivo(byte[] arquivo) {
        this.arquivo = arquivo;
    }

    public String getStatusAgenda() {
        return statusAgenda;
    }

    public void setStatusAgenda(String statusAgenda) {
        this.statusAgenda = statusAgenda;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public Boolean getNotificar() {
        return notificar;
    }

    public void setNotificar(Boolean notificar) {
        this.notificar = notificar != null ? notificar : true;
    }

    public Integer getAntecedenciaNotificacao() {
        return antecedenciaNotificacao;
    }

    public void setAntecedenciaNotificacao(Integer antecedenciaNotificacao) {
        if (antecedenciaNotificacao == null) {
            this.antecedenciaNotificacao = 30;
            return;
        }

        this.antecedenciaNotificacao = Math.max(0, Math.min(60, antecedenciaNotificacao));
    }

    public String getGoogleEventId() {
        return googleEventId;
    }

    public void setGoogleEventId(String googleEventId) {
        this.googleEventId = googleEventId;
    }

    public Boolean getSincronizadoGoogle() {
        return sincronizadoGoogle;
    }

    public void setSincronizadoGoogle(Boolean sincronizadoGoogle) {
        this.sincronizadoGoogle = sincronizadoGoogle != null ? sincronizadoGoogle : false;
    }
}
