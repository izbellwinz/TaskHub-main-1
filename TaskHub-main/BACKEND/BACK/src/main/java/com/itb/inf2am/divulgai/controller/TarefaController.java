package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Tarefa;
import com.itb.inf2am.divulgai.services.TarefaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tarefas")
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

    @GetMapping
    public ResponseEntity<List<Tarefa>> findAll() {
        return ResponseEntity.ok(tarefaService.findAll());
    }

    @GetMapping("/agenda/{agendaId}")
    public ResponseEntity<Object> findByAgendaId(@PathVariable String agendaId) {
        try {
            return ResponseEntity.ok(tarefaService.findByAgendaId(Long.parseLong(agendaId)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", "O id informado não é válido: " + agendaId
            ));
        }
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Tarefa tarefa) {
        Tarefa tarefaSalva = tarefaService.save(tarefa);
        return ResponseEntity.status(HttpStatus.CREATED).body(tarefaSalva);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(tarefaService.findById(Long.parseLong(id)));
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
                "message", "Tarefa não encontrada com o id " + id
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable String id, @RequestBody Tarefa tarefa) {
        try {
            Long tarefaId = Long.parseLong(id);
            Tarefa tarefaExistente = tarefaService.findById(tarefaId);

            tarefaExistente.setAgendaId(tarefa.getAgendaId());
            tarefaExistente.setDataVencimento(tarefa.getDataVencimento());
            tarefaExistente.setAntecedenciaNotificacao(tarefa.getAntecedenciaNotificacao());
            tarefaExistente.setDescricao(tarefa.getDescricao());
            tarefaExistente.setStatusTarefa(tarefa.getStatusTarefa());
            tarefaExistente.setCor(tarefa.getCor());
            tarefaExistente.setArquivo(tarefa.getArquivo());

            Tarefa tarefaAtualizada = tarefaService.save(tarefaExistente);
            return ResponseEntity.ok(tarefaAtualizada);
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
                "message", "Tarefa não encontrada com o id " + id
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluir(@PathVariable String id) {
        try {
            Long tarefaId = Long.parseLong(id);
            tarefaService.delete(tarefaId);
            return ResponseEntity.ok(Map.of("message", "Tarefa deletada com sucesso"));
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
                "message", "Tarefa não encontrada com o id " + id
            ));
        }
    }
}
