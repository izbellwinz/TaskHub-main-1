import http from '../common/http-common';

const API_URL = '/api/v1/google-calendar';

const getStatus = (usuarioId) => {
  return http.mainInstance.get(`${API_URL}/status/${usuarioId}`);
};

const getAuthUrl = () => {
  return http.mainInstance.get(`${API_URL}/auth-url`);
};

const syncAgenda = (agendaId) => {
  return http.mainInstance.post(`${API_URL}/sync-agenda/${agendaId}`);
};

const deleteEvent = (agendaId) => {
  return http.mainInstance.delete(`${API_URL}/event/${agendaId}`);
};

const GoogleCalendarService = {
  getStatus,
  getAuthUrl,
  syncAgenda,
  deleteEvent,
};

export default GoogleCalendarService;
