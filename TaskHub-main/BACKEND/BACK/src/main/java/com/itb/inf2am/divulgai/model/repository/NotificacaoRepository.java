package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findByUsuarioId(Long usuarioId);
}
