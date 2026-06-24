package com.itb.inf2am.divulgai.model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itb.inf2am.divulgai.model.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Usuario findByUsernameAndPassword(String email, String senha);
    boolean existsByUsername(String email);
    Optional<Usuario> findByUsername(String email);
}