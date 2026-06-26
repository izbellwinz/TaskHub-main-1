package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.services.GoogleCalendarService;
import com.itb.inf2am.divulgai.services.GoogleOAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/google-calendar")
public class GoogleCalendarController {

    @Autowired
    private GoogleOAuthService googleOAuthService;

    @Autowired
    private GoogleCalendarService googleCalendarService;

    @GetMapping("/auth-url")
    public ResponseEntity<Map<String, Object>> authUrl() {
        if (!googleOAuthService.isConfigured()) {
            return ResponseEntity.ok(Map.of(
                    "configured", false,
                    "authUrl", "",
                    "message", "Google Agenda nao configurado no backend."));
        }

        return ResponseEntity.ok(Map.of(
                "configured", true,
                "authUrl", googleOAuthService.buildAuthUrl()));
    }

    @GetMapping("/callback")
    public ResponseEntity<Map<String, Object>> callback(@RequestParam(required = false) String code) {
        return ResponseEntity.ok(Map.of(
                "receivedCode", code != null && !code.isBlank(),
                "message", "Callback OAuth preparado. Troca por token e armazenamento seguro ainda nao implementados."));
    }

    @PostMapping("/sync-agenda/{agendaId}")
    public ResponseEntity<Map<String, Object>> syncAgenda(@PathVariable Long agendaId) {
        return ResponseEntity.ok(googleCalendarService.syncAgenda(agendaId));
    }

    @DeleteMapping("/event/{agendaId}")
    public ResponseEntity<Map<String, Object>> deleteEvent(@PathVariable Long agendaId) {
        return ResponseEntity.ok(googleCalendarService.deleteGoogleEvent(agendaId));
    }

    @GetMapping("/status/{usuarioId}")
    public ResponseEntity<Map<String, Object>> status(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(googleCalendarService.status(usuarioId));
    }
}
