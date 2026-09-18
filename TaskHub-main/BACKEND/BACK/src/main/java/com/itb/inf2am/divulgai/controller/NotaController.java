package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Nota;
import com.itb.inf2am.divulgai.services.NotaService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/notas")
public class NotaController {
    private final NotaService service;
    public NotaController(NotaService service) { this.service = service; }
    @GetMapping("/usuario/{usuarioId}") public List<Nota> porUsuario(@PathVariable Long usuarioId) { return service.findByUsuarioId(usuarioId); }
    @PostMapping public ResponseEntity<Nota> criar(@RequestBody Nota nota) { return ResponseEntity.status(HttpStatus.CREATED).body(service.save(nota)); }
    @PutMapping("/{id}") public Nota atualizar(@PathVariable Long id, @RequestBody Nota nota) { return service.update(id, nota); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> excluir(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
