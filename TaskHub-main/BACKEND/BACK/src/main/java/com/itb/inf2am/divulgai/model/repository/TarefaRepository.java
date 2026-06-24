package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {

    List<Tarefa> findByAgendaId(Long agendaId);
}
