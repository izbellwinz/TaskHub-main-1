package com.itb.inf2am.divulgai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // ================= CSRF / CORS =================
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())

            // ================= AUTORIZAÇÃO =================
            // Todas as rotas /api/v1/** são públicas.
            // O controle de acesso é feito manualmente nos controllers.
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos (evita ambiguidades de matcher e garante criação de conta)
                .requestMatchers("/api/v1/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/usuarios").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/usuarios/login").permitAll()
            .anyRequest().authenticated()
            )

            // ================= LOGIN/LOGOUT =================
            // formLogin removido: o projeto usa endpoint REST próprio
            // em /api/v1/usuarios/login para autenticação via JSON.
            .formLogin(AbstractHttpConfigurer::disable)
            .logout(AbstractHttpConfigurer::disable);


        return http.build();
    }

    // ================= PASSWORD ENCODER =================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}