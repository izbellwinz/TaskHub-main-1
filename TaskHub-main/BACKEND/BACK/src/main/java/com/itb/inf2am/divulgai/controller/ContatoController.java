package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Contato;
import com.itb.inf2am.divulgai.services.ContatoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/contatos")
@CrossOrigin(origins = "http://localhost:5173")
public class ContatoController {

    @Autowired
    private ContatoService contatoService;

    @GetMapping
    public ResponseEntity<List<Contato>> findAll() {
        return ResponseEntity.ok(contatoService.findAll());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Object> findByUsuarioId(@PathVariable String usuarioId) {
        try {
            return ResponseEntity.ok(contatoService.findByUsuarioId(Long.parseLong(usuarioId)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", "O id informado não é válido: " + usuarioId
            ));
        }
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Contato contato) {
        Contato contatoSalvo = contatoService.save(contato);
        return ResponseEntity.status(HttpStatus.CREATED).body(contatoSalvo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(contatoService.findById(Long.parseLong(id)));
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
                "message", "Contato não encontrado com o id " + id
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluir(@PathVariable String id) {
        try {
            Long contatoId = Long.parseLong(id);
            contatoService.delete(contatoId);
            return ResponseEntity.ok(Map.of("message", "Contato deletado com sucesso"));
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
                "message", "Contato não encontrado com o id " + id
            ));
        }
    }
}
