package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.Contato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContatoRepository extends JpaRepository<Contato, Long> {

    List<Contato> findByUsuarioId(Long usuarioId);
}
