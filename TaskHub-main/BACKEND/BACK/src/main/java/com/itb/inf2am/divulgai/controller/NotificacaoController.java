package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Notificacao;
import com.itb.inf2am.divulgai.services.NotificacaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notificacoes")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping
    public ResponseEntity<List<Notificacao>> findAll() {
        return ResponseEntity.ok(notificacaoService.findAll());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Object> findByUsuarioId(@PathVariable String usuarioId) {
        try {
            return ResponseEntity.ok(notificacaoService.findByUsuarioId(Long.parseLong(usuarioId)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", "O id informado não é válido: " + usuarioId
            ));
        }
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Notificacao notificacao) {
        Notificacao notificacaoSalva = notificacaoService.save(notificacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(notificacaoSalva);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(notificacaoService.findById(Long.parseLong(id)));
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
                "message", "Notificacao não encontrada com o id " + id
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable String id, @RequestBody Notificacao notificacao) {
        try {
            Long notificacaoId = Long.parseLong(id);
            Notificacao notificacaoExistente = notificacaoService.findById(notificacaoId);

            notificacaoExistente.setMensagem(notificacao.getMensagem());
            notificacaoExistente.setLida(notificacao.getLida());
            notificacaoExistente.setStatusNotificacao(notificacao.getStatusNotificacao());

            Notificacao notificacaoAtualizada = notificacaoService.save(notificacaoExistente);
            return ResponseEntity.ok(notificacaoAtualizada);
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
                "message", "Notificacao não encontrada com o id " + id
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluir(@PathVariable String id) {
        try {
            Long notificacaoId = Long.parseLong(id);
            notificacaoService.delete(notificacaoId);
            return ResponseEntity.ok(Map.of("message", "Notificacao deletada com sucesso"));
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
                "message", "Notificacao não encontrada com o id " + id
            ));
        }
    }
}
