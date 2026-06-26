package com.itb.inf2am.divulgai.services;

import com.itb.inf2am.divulgai.model.entity.Agenda;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class GoogleCalendarService {

    @Autowired
    private AgendaService agendaService;

    @Autowired
    private GoogleOAuthService googleOAuthService;

    public Map<String, Object> status(Long usuarioId) {
        return Map.of(
                "configured", googleOAuthService.isConfigured(),
                "connected", false,
                "message", googleOAuthService.isConfigured()
                        ? "OAuth configurado. Persistencia de token ainda nao implementada."
                        : "Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_REDIRECT_URI.");
    }

    public Map<String, Object> syncAgenda(Long agendaId) {
        Agenda agenda = agendaService.findById(agendaId);
        int antecedencia = Math.max(0, Math.min(60, agenda.getAntecedenciaNotificacao()));

        return Map.of(
                "agendaId", agenda.getId(),
                "configured", googleOAuthService.isConfigured(),
                "synced", false,
                "reminderMinutes", antecedencia,
                "message", "Estrutura de sincronizacao criada. Para enviar ao Google Calendar falta concluir OAuth e armazenamento seguro de token.");
    }

    public Map<String, Object> deleteGoogleEvent(Long agendaId) {
        Agenda agenda = agendaService.findById(agendaId);

        return Map.of(
                "agendaId", agenda.getId(),
                "deleted", false,
                "message", "Exclusao no Google Calendar preparada, mas depende de token OAuth persistido.");
    }
}
