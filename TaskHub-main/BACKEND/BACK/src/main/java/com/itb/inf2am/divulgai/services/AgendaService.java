package com.itb.inf2am.divulgai.services;

import com.itb.inf2am.divulgai.model.entity.Agenda;
import com.itb.inf2am.divulgai.model.repository.AgendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgendaService {

    @Autowired
    private AgendaRepository agendaRepository;

    private void aplicarCamposNotificacao(Agenda destino, Agenda origem) {
        destino.setNotificar(origem.getNotificar());
        destino.setAntecedenciaNotificacao(origem.getAntecedenciaNotificacao());
        destino.setGoogleEventId(origem.getGoogleEventId());
        destino.setSincronizadoGoogle(origem.getSincronizadoGoogle());
    }

    // Método responsável em listar todas as Agendas cadastradas no banco de dados
    public List<Agenda> findAll() {
        return agendaRepository.findAll();
    }

    // Método responsável em listar Agendas por usuário
    public List<Agenda> findByUsuarioId(Long usuarioId) {
        return agendaRepository.findByUsuarioId(usuarioId);
    }

    // Método responsável em Criar a Agenda no banco de dados
    public Agenda save(Agenda agenda) {
        agenda.setNotificar(agenda.getNotificar());
        agenda.setAntecedenciaNotificacao(agenda.getAntecedenciaNotificacao());
        agenda.setSincronizadoGoogle(agenda.getSincronizadoGoogle());
        return agendaRepository.save(agenda);
    }

    // Método responsável em listar a Agenda por ID
    public Agenda findById(Long id) {
        return agendaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agenda não encontrada com o id " + id));
    }

    // Método responsável em atualizar Agenda
    public Agenda update(Long id, Agenda agenda) {
        Agenda agendaExistente = findById(id);
        agendaExistente.setUsuarioId(agenda.getUsuarioId());
        agendaExistente.setDataAgenda(agenda.getDataAgenda());
        agendaExistente.setHora(agenda.getHora());
        agendaExistente.setTitulo(agenda.getTitulo());
        agendaExistente.setDescricao(agenda.getDescricao());
        agendaExistente.setArquivo(agenda.getArquivo());
        agendaExistente.setStatusAgenda(agenda.getStatusAgenda());
        agendaExistente.setCor(agenda.getCor());
        aplicarCamposNotificacao(agendaExistente, agenda);
        return agendaRepository.save(agendaExistente);
    }

    // Método responsável em excluir a Agenda ( exclusão física )
    public void delete(Long id) {
        Agenda agendaExistente = findById(id);
        agendaRepository.delete(agendaExistente);
    }
}
