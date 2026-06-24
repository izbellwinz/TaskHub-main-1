package com.itb.inf2am.divulgai.services;

import com.itb.inf2am.divulgai.model.entity.Configuracao;
import com.itb.inf2am.divulgai.model.repository.ConfiguracaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfiguracaoService {

    @Autowired
    private ConfiguracaoRepository configuracaoRepository;

    // Método responsável em listar todas as Configuracoes cadastradas no banco de dados
    public List<Configuracao> findAll() {
        return configuracaoRepository.findAll();
    }

    // Método responsável em listar Configuracao por usuário
    public Configuracao findByUsuarioId(Long usuarioId) {
        return configuracaoRepository.findByUsuarioId(usuarioId);
    }

    // Método responsável em Criar a Configuracao no banco de dados
    public Configuracao save(Configuracao configuracao) {
        return configuracaoRepository.save(configuracao);
    }

    // Método responsável em listar a Configuracao por ID
    public Configuracao findById(Long id) {
        return configuracaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Configuracao não encontrada com o id " + id));
    }

    // Método responsável em atualizar Configuracao
    public Configuracao update(Long id, Configuracao configuracao) {
        Configuracao configuracaoExistente = findById(id);
        configuracaoExistente.setPrimeiroDiaSemana(configuracao.getPrimeiroDiaSemana());
        configuracaoExistente.setFormatoHora(configuracao.getFormatoHora());
        configuracaoExistente.setTema(configuracao.getTema());
        configuracaoExistente.setMostrarEmail(configuracao.getMostrarEmail());
        configuracaoExistente.setReceberEmail(configuracao.getReceberEmail());
        return configuracaoRepository.save(configuracaoExistente);
    }

    // Método responsável em excluir a Configuracao ( exclusão física )
    public void delete(Long id) {
        Configuracao configuracaoExistente = findById(id);
        configuracaoRepository.delete(configuracaoExistente);
    }
}
