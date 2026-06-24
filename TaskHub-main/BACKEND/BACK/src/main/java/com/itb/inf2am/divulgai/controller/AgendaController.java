package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Agenda;
import com.itb.inf2am.divulgai.services.AgendaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/agendas")
public class AgendaController {

    @Autowired
    private AgendaService agendaService;

    @GetMapping
    public ResponseEntity<List<Agenda>> findAll() {
        return ResponseEntity.ok(agendaService.findAll());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Object> findByUsuarioId(@PathVariable String usuarioId) {
        try {
            return ResponseEntity.ok(agendaService.findByUsuarioId(Long.parseLong(usuarioId)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", "O id informado não é válido: " + usuarioId
            ));
        }
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Agenda agenda) {
        Agenda agendaSalva = agendaService.save(agenda);
        return ResponseEntity.status(HttpStatus.CREATED).body(agendaSalva);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(agendaService.findById(Long.parseLong(id)));
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
                "message", "Agenda não encontrada com o id " + id
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable String id, @RequestBody Agenda agenda) {
        try {
            Long agendaId = Long.parseLong(id);
            Agenda agendaExistente = agendaService.findById(agendaId);

            agendaExistente.setUsuarioId(agenda.getUsuarioId());
            agendaExistente.setDataAgenda(agenda.getDataAgenda());
            agendaExistente.setHora(agenda.getHora());
            agendaExistente.setTitulo(agenda.getTitulo());
            agendaExistente.setDescricao(agenda.getDescricao());
            agendaExistente.setArquivo(agenda.getArquivo());
            agendaExistente.setStatusAgenda(agenda.getStatusAgenda());
            agendaExistente.setCor(agenda.getCor());

            Agenda agendaAtualizada = agendaService.save(agendaExistente);
            return ResponseEntity.ok(agendaAtualizada);
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
                "message", "Agenda não encontrada com o id " + id
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluir(@PathVariable String id) {
        try {
            Long agendaId = Long.parseLong(id);
            agendaService.delete(agendaId);
            return ResponseEntity.ok(Map.of("message", "Agenda deletada com sucesso"));
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
                "message", "Agenda não encontrada com o id " + id
            ));
        }
    }
}
