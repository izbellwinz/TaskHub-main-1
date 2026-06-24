package com.itb.inf2am.divulgai.services;

import com.itb.inf2am.divulgai.model.entity.Tarefa;
import com.itb.inf2am.divulgai.model.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarefaService {

    @Autowired
    private TarefaRepository tarefaRepository;

    // Método responsável em listar todas as Tarefas cadastradas no banco de dados
    public List<Tarefa> findAll() {
        return tarefaRepository.findAll();
    }

    // Método responsável em listar Tarefas por Agenda
    public List<Tarefa> findByAgendaId(Long agendaId) {
        return tarefaRepository.findByAgendaId(agendaId);
    }

    // Método responsável em Criar a Tarefa no banco de dados
    public Tarefa save(Tarefa tarefa) {
        return tarefaRepository.save(tarefa);
    }

    // Método responsável em listar a Tarefa por ID
    public Tarefa findById(Long id) {
        return tarefaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada com o id " + id));
    }

    // Método responsável em atualizar Tarefa
    public Tarefa update(Long id, Tarefa tarefa) {
        Tarefa tarefaExistente = findById(id);
        tarefaExistente.setAgendaId(tarefa.getAgendaId());
        tarefaExistente.setDataVencimento(tarefa.getDataVencimento());
        tarefaExistente.setAntecedenciaNotificacao(tarefa.getAntecedenciaNotificacao());
        tarefaExistente.setDescricao(tarefa.getDescricao());
        tarefaExistente.setStatusTarefa(tarefa.getStatusTarefa());
        tarefaExistente.setCor(tarefa.getCor());
        tarefaExistente.setArquivo(tarefa.getArquivo());
        return tarefaRepository.save(tarefaExistente);
    }

    // Método responsável em excluir a Tarefa ( exclusão física )
    public void delete(Long id) {
        Tarefa tarefaExistente = findById(id);
        tarefaRepository.delete(tarefaExistente);
    }
}
