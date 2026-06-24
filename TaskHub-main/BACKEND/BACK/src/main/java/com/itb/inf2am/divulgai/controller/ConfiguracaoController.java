package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Configuracao;
import com.itb.inf2am.divulgai.services.ConfiguracaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/configuracoes")
@CrossOrigin(origins = "http://localhost:5173")
public class ConfiguracaoController {

    @Autowired
    private ConfiguracaoService configuracaoService;

    @GetMapping
    public ResponseEntity<List<Configuracao>> findAll() {
        return ResponseEntity.ok(configuracaoService.findAll());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Object> findByUsuarioId(@PathVariable String usuarioId) {
        try {
            return ResponseEntity.ok(configuracaoService.findByUsuarioId(Long.parseLong(usuarioId)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", "O id informado não é válido: " + usuarioId
            ));
        }
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Configuracao configuracao) {
        Configuracao configuracaoSalva = configuracaoService.save(configuracao);
        return ResponseEntity.status(HttpStatus.CREATED).body(configuracaoSalva);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(configuracaoService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", "O id informado não é válido: " + id
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of(
                "status", 404,
                "error", "Not Found",
                "message", "Configuracao não encontrada com o id " + id
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable String id, @RequestBody Configuracao configuracao) {
        try {
            Long configuracaoId = Long.parseLong(id);
            Configuracao configuracaoExistente = configuracaoService.findById(configuracaoId);

            configuracaoExistente.setPrimeiroDiaSemana(configuracao.getPrimeiroDiaSemana());
            configuracaoExistente.setFormatoHora(configuracao.getFormatoHora());
            configuracaoExistente.setTema(configuracao.getTema());
            configuracaoExistente.setMostrarEmail(configuracao.getMostrarEmail());
            configuracaoExistente.setReceberEmail(configuracao.getReceberEmail());

            Configuracao configuracaoAtualizada = configuracaoService.save(configuracaoExistente);
            return ResponseEntity.ok(configuracaoAtualizada);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", "O id informado não é válido: " + id
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of(
                "status", 404,
                "error", "Not Found",
                "message", "Configuracao não encontrada com o id " + id
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluir(@PathVariable String id) {
        try {
            Long configuracaoId = Long.parseLong(id);
            configuracaoService.delete(configuracaoId);
            return ResponseEntity.ok(Map.of("message", "Configuracao deletada com sucesso"));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", "O id informado não é válido: " + id
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of(
                "status", 404,
                "error", "Not Found",
                "message", "Configuracao não encontrada com o id " + id
            ));
        }
    }
}
