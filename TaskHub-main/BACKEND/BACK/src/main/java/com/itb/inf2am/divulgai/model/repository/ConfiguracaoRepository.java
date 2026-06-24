package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.Configuracao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfiguracaoRepository extends JpaRepository<Configuracao, Long> {

    Configuracao findByUsuarioId(Long usuarioId);
}
