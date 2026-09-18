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
        destino.setTipoCompromisso(origem.getTipoCompromisso());
        destino.setRecorrenteAnual(origem.getRecorrenteAnual());
        destino.setSalvarAnexo(origem.getSalvarAnexo());
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
        agenda.setTipoCompromisso(agenda.getTipoCompromisso());
        agenda.setRecorrenteAnual(agenda.getRecorrenteAnual());
        agenda.setSalvarAnexo(agenda.getSalvarAnexo());
        normalizarTipoCompromisso(agenda);
        return agendaRepository.save(agenda);
    }

    private void normalizarTipoCompromisso(Agenda agenda) {
        String tipo = agenda.getTipoCompromisso();
        if (!"EVENTO".equals(tipo) && !"TAREFA".equals(tipo) && !"ANIVERSARIO".equals(tipo)) {
            agenda.setTipoCompromisso("EVENTO");
        }
        agenda.setRecorrenteAnual("ANIVERSARIO".equals(agenda.getTipoCompromisso()));
        if ("TAREFA".equals(agenda.getTipoCompromisso())) {
            String status = agenda.getStatusAgenda();
            agenda.setStatusAgenda("CONCLUIDO".equalsIgnoreCase(status) ? "CONCLUIDO" : "PENDENTE");
        }
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
