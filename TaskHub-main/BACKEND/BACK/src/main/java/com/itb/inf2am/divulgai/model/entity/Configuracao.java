package com.itb.inf2am.divulgai.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Configuracao")
public class Configuracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "primeiroDiaSemana", length = 15, nullable = true)
    private String primeiroDiaSemana;

    @Column(name = "formatoHora", length = 10, nullable = false)
    private String formatoHora;

    @Column(name = "tema", length = 20, nullable = true)
    private String tema;

    @Column(name = "mostrarEmail", nullable = false)
    private Boolean mostrarEmail = false;

    @Column(name = "receberEmail", nullable = false)
    private Boolean receberEmail = true;

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

    public String getPrimeiroDiaSemana() {
        return primeiroDiaSemana;
    }

    public void setPrimeiroDiaSemana(String primeiroDiaSemana) {
        this.primeiroDiaSemana = primeiroDiaSemana;
    }

    public String getFormatoHora() {
        return formatoHora;
    }

    public void setFormatoHora(String formatoHora) {
        this.formatoHora = formatoHora;
    }

    public String getTema() {
        return tema;
    }

    public void setTema(String tema) {
        this.tema = tema;
    }

    public Boolean getMostrarEmail() {
        return mostrarEmail;
    }

    public void setMostrarEmail(Boolean mostrarEmail) {
        this.mostrarEmail = mostrarEmail;
    }

    public Boolean getReceberEmail() {
        return receberEmail;
    }

    public void setReceberEmail(Boolean receberEmail) {
        this.receberEmail = receberEmail;
    }
}
