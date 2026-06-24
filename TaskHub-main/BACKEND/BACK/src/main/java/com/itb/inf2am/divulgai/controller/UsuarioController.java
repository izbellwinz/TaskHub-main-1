package com.itb.inf2am.divulgai.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itb.inf2am.divulgai.model.entity.Usuario;
import com.itb.inf2am.divulgai.services.UsuarioService;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> findAll() {
        List<Map<String, Object>> usuarios = usuarioService.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Map<String, String> dados) {
        Usuario usuario = fromRequest(dados);

        if (isBlank(usuario.getUsername()) || isBlank(usuario.getPassword()) || isBlank(usuario.getNome())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Nome, email e senha sao obrigatorios"));
        }

        if (usuarioService.emailExiste(usuario.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username ja cadastrado"));
        }

        Usuario usuarioSalvo = usuarioService.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(usuarioSalvo));
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> dados) {
        String email = firstNonBlank(dados.get("email"), dados.get("username"));
        String senha = firstNonBlank(dados.get("senha"), dados.get("password"));

        Usuario usuario = usuarioService.login(email, senha);
        if (usuario != null) {
            return ResponseEntity.ok(toResponse(usuario));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Username ou senha incorretos"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> listarUsuarioPorId(@PathVariable String id) {
        try {
            return ResponseEntity.ok(toResponse(usuarioService.findById(Long.parseLong(id))));
        } catch (NumberFormatException e) {
            return badId(id);
        } catch (RuntimeException e) {
            return notFound(id);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizarUsuario(@PathVariable String id, @RequestBody Map<String, String> dados) {
        try {
            Long usuarioId = Long.parseLong(id);
            Usuario usuarioExistente = usuarioService.findById(usuarioId);

            String nome = dados.get("nome");
            String username = firstNonBlank(dados.get("username"), dados.get("email"));
            String password = firstNonBlank(dados.get("password"), dados.get("senha"));

            if (!isBlank(nome)) {
                usuarioExistente.setNome(nome);
            }
            if (!isBlank(username)) {
                usuarioExistente.setUsername(username);
            }
            if (!isBlank(password)) {
                usuarioExistente.setPassword(password);
            }

            Usuario usuarioAtualizado = usuarioService.save(usuarioExistente);
            return ResponseEntity.ok(toResponse(usuarioAtualizado));
        } catch (NumberFormatException e) {
            return badId(id);
        } catch (RuntimeException e) {
            return notFound(id);
        }
    }

    @PostMapping({"/resetPassword", "/resetSenha"})
    public ResponseEntity<Object> resetPassword(@RequestBody Map<String, String> dados) {
        String email = firstNonBlank(dados.get("email"), dados.get("username"));
        String novaSenha = firstNonBlank(dados.get("novaPassword"), dados.get("novaSenha"), dados.get("password"), dados.get("senha"));

        if (isBlank(email) || isBlank(novaSenha)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username e nova senha sao obrigatorios"));
        }

        Usuario usuario = usuarioService.findByUsername(email);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Username nao encontrado"));
        }

        usuario.setPassword(novaSenha);
        usuarioService.save(usuario);
        return ResponseEntity.ok(Map.of("message", "Password redefinida com sucesso"));
    }

    @PutMapping({"/alterarPassword/{id}", "/alterarSenha/{id}"})
    public ResponseEntity<Object> alterarPassword(@PathVariable String id, @RequestParam String senha) {
        try {
            Long usuarioId = Long.parseLong(id);
            Usuario usuarioExistente = usuarioService.findById(usuarioId);
            usuarioExistente.setPassword(senha);
            usuarioService.save(usuarioExistente);
            return ResponseEntity.ok(Map.of("message", "Password alterada com sucesso"));
        } catch (NumberFormatException e) {
            return badId(id);
        } catch (RuntimeException e) {
            return notFound(id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluirUsuario(@PathVariable String id) {
        try {
            Long usuarioId = Long.parseLong(id);
            usuarioService.delete(usuarioId);
            return ResponseEntity.ok(Map.of("message", "Usuario deletado com sucesso"));
        } catch (NumberFormatException e) {
            return badId(id);
        } catch (RuntimeException e) {
            return notFound(id);
        }
    }

    @PutMapping("/inativar/{id}")
    public ResponseEntity<Object> inativarUsuario(@PathVariable String id) {
        try {
            Long usuarioId = Long.parseLong(id);
            return ResponseEntity.ok(toResponse(usuarioService.inativar(usuarioId)));
        } catch (NumberFormatException e) {
            return badId(id);
        } catch (RuntimeException e) {
            return notFound(id);
        }
    }

    @PutMapping("/reativar/{id}")
    public ResponseEntity<Object> reativarUsuario(@PathVariable String id) {
        try {
            Long usuarioId = Long.parseLong(id);
            return ResponseEntity.ok(toResponse(usuarioService.reativar(usuarioId)));
        } catch (NumberFormatException e) {
            return badId(id);
        } catch (RuntimeException e) {
            return notFound(id);
        }
    }

    private Usuario fromRequest(Map<String, String> dados) {
        Usuario usuario = new Usuario();
        usuario.setNome(dados.get("nome"));
        usuario.setUsername(firstNonBlank(dados.get("username"), dados.get("email")));
        usuario.setPassword(firstNonBlank(dados.get("password"), dados.get("senha")));
        usuario.setNivelAcesso(dados.get("nivelAcesso"));
        return usuario;
    }

    private Map<String, Object> toResponse(Usuario usuario) {
        return Map.of(
                "id", usuario.getId(),
                "nome", usuario.getNome(),
                "username", usuario.getUsername(),
                "email", usuario.getUsername(),
                "nivelAcesso", usuario.getNivelAcesso(),
                "statusUsuario", usuario.getStatusUsuario()
        );
    }

    private ResponseEntity<Object> badId(String id) {
        return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", "O id informado nao e valido: " + id));
    }

    private ResponseEntity<Object> notFound(String id) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", 404,
                "error", "Not Found",
                "message", "Usuario nao encontrado com o id " + id));
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (!isBlank(value)) {
                return value;
            }
        }
        return null;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
