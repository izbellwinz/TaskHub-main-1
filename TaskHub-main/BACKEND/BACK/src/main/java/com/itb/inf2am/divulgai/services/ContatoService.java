package com.itb.inf2am.divulgai.services;

import com.itb.inf2am.divulgai.model.entity.Contato;
import com.itb.inf2am.divulgai.model.repository.ContatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContatoService {

    @Autowired
    private ContatoRepository contatoRepository;

    // Método responsável em listar todos os Contatos cadastrados no banco de dados
    public List<Contato> findAll() {
        return contatoRepository.findAll();
    }

    // Método responsável em listar Contatos por usuário
    public List<Contato> findByUsuarioId(Long usuarioId) {
        return contatoRepository.findByUsuarioId(usuarioId);
    }

    // Método responsável em Criar o Contato no banco de dados
    public Contato save(Contato contato) {
        return contatoRepository.save(contato);
    }

    // Método responsável em listar o Contato por ID
    public Contato findById(Long id) {
        return contatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contato não encontrado com o id " + id));
    }

    // Método responsável em excluir o Contato ( exclusão física )
    public void delete(Long id) {
        Contato contatoExistente = findById(id);
        contatoRepository.delete(contatoExistente);
    }
}
