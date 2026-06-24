package com.itb.inf2am.divulgai.services;

import com.itb.inf2am.divulgai.model.entity.Notificacao;
import com.itb.inf2am.divulgai.model.repository.NotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    // Método responsável em listar todas as Notificacoes cadastradas no banco de dados
    public List<Notificacao> findAll() {
        return notificacaoRepository.findAll();
    }

    // Método responsável em listar Notificacoes por usuário
    public List<Notificacao> findByUsuarioId(Long usuarioId) {
        return notificacaoRepository.findByUsuarioId(usuarioId);
    }

    // Método responsável em Criar a Notificacao no banco de dados
    public Notificacao save(Notificacao notificacao) {
        return notificacaoRepository.save(notificacao);
    }

    // Método responsável em listar a Notificacao por ID
    public Notificacao findById(Long id) {
        return notificacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificacao não encontrada com o id " + id));
    }

    // Método responsável em atualizar Notificacao
    public Notificacao update(Long id, Notificacao notificacao) {
        Notificacao notificacaoExistente = findById(id);
        notificacaoExistente.setMensagem(notificacao.getMensagem());
        notificacaoExistente.setLida(notificacao.getLida());
        notificacaoExistente.setStatusNotificacao(notificacao.getStatusNotificacao());
        return notificacaoRepository.save(notificacaoExistente);
    }

    // Método responsável em excluir a Notificacao ( exclusão física )
    public void delete(Long id) {
        Notificacao notificacaoExistente = findById(id);
        notificacaoRepository.delete(notificacaoExistente);
    }
}
