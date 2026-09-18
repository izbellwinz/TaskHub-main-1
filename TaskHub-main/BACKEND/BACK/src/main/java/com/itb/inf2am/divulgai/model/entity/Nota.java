package com.itb.inf2am.divulgai.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Nota")
public class Nota {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    @Column(length = 120, nullable = false)
    private String titulo;
    @Column(length = 2000)
    private String conteudo;
    @Column(length = 20)
    private String cor;
    private Boolean importante = false;
    @Column(nullable = false)
    private LocalDateTime dataAtualizacao;

    @PrePersist @PreUpdate
    protected void atualizarData() { dataAtualizacao = LocalDateTime.now(); }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Long getUsuarioId() { return usuarioId; } public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getTitulo() { return titulo; } public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getConteudo() { return conteudo; } public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    public String getCor() { return cor; } public void setCor(String cor) { this.cor = cor; }
    public Boolean getImportante() { return importante; } public void setImportante(Boolean importante) { this.importante = importante != null && importante; }
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; } public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
}
