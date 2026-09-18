package com.itb.inf2am.divulgai.services;

import com.itb.inf2am.divulgai.model.entity.Nota;
import com.itb.inf2am.divulgai.model.repository.NotaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotaService {
    private final NotaRepository repository;
    public NotaService(NotaRepository repository) { this.repository = repository; }
    public List<Nota> findByUsuarioId(Long usuarioId) { return repository.findByUsuarioIdOrderByDataAtualizacaoDesc(usuarioId); }
    public Nota save(Nota nota) { return repository.save(nota); }
    public Nota findById(Long id) { return repository.findById(id).orElseThrow(() -> new RuntimeException("Nota não encontrada com o id " + id)); }
    public Nota update(Long id, Nota origem) {
        Nota nota = findById(id);
        nota.setTitulo(origem.getTitulo()); nota.setConteudo(origem.getConteudo()); nota.setCor(origem.getCor()); nota.setImportante(origem.getImportante());
        return repository.save(nota);
    }
    public void delete(Long id) { repository.delete(findById(id)); }
}
