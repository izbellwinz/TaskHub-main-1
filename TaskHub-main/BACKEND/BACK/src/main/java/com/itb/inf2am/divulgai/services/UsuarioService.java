package com.itb.inf2am.divulgai.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.itb.inf2am.divulgai.model.entity.Usuario;
import com.itb.inf2am.divulgai.model.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Usuario save(Usuario usuario) {

        prepararUsuarioParaSalvar(usuario);
        return usuarioRepository.save(usuario);
    }

    public Usuario login(String email, String senha) {
        if (email == null || senha == null) {
            return null;
        }

        Usuario usuario = usuarioRepository.findByUsername(email).orElse(null);
        if (usuario == null || !"ATIVO".equalsIgnoreCase(usuario.getStatusUsuario())) {
            return null;
        }

        if (!senhaConfere(senha, usuario.getPassword())) {
            return null;
        }

        if (!isSenhaCriptografada(usuario.getPassword())) {
            usuario.setPassword(senha);
            save(usuario);
        }

        return usuario;
    }

    public boolean emailExiste(String email) {
        return usuarioRepository.existsByUsername(email);
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado com o id " + id));
    }

    public Usuario update(Long id, Usuario usuario) {
        Usuario usuarioExistente = findById(id);
        usuarioExistente.setNome(usuario.getNome());
        usuarioExistente.setUsername(usuario.getUsername());
        usuarioExistente.setPassword(usuario.getPassword());
        usuarioExistente.setNivelAcesso(usuario.getNivelAcesso());
        return save(usuarioExistente);
    }

    public void delete(Long id) {
        Usuario usuarioExistente = findById(id);
        usuarioRepository.delete(usuarioExistente);
    }

    public Usuario inativar(Long id) {
        Usuario usuarioExistente = findById(id);
        usuarioExistente.setStatusUsuario("INATIVO");
        usuarioExistente.setDataAtualizacao(LocalDateTime.now());
        return usuarioRepository.save(usuarioExistente);
    }

    public Usuario findByUsername(String email) {
        return usuarioRepository.findByUsername(email).orElse(null);
    }

    public Usuario reativar(Long id) {
        Usuario usuarioExistente = findById(id);
        usuarioExistente.setStatusUsuario("ATIVO");
        usuarioExistente.setDataAtualizacao(LocalDateTime.now());
        return usuarioRepository.save(usuarioExistente);
    }

    private void prepararUsuarioParaSalvar(Usuario usuario) {
        if (usuario.getStatusUsuario() == null || usuario.getStatusUsuario().isBlank()) {
            usuario.setStatusUsuario("ATIVO");
        } else {
            usuario.setStatusUsuario(usuario.getStatusUsuario().toUpperCase());
        }

        if (usuario.getNivelAcesso() == null || usuario.getNivelAcesso().isBlank()) {
            usuario.setNivelAcesso("USER");
        }

        if (usuario.getDataCadastro() == null) {
            usuario.setDataCadastro(LocalDateTime.now());
        }

        if (usuario.getId() != null) {
            usuario.setDataAtualizacao(LocalDateTime.now());
        }

        if (usuario.getPassword() != null && !isSenhaCriptografada(usuario.getPassword())) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
    }

    private boolean isSenhaCriptografada(String password) {
        return password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$");
    }

    private boolean senhaConfere(String senhaInformada, String senhaSalva) {
        if (senhaSalva == null) {
            return false;
        }

        if (isSenhaCriptografada(senhaSalva)) {
            return passwordEncoder.matches(senhaInformada, senhaSalva);
        }

        return senhaInformada.equals(senhaSalva);
    }
}
