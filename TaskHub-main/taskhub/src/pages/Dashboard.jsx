import { useState, useEffect } from 'react';
import './Dashboard.css';
import AgendaService from '../services/AgendaService';
import NotificacaoService from '../services/NotificacaoService';
import ConfiguracaoService from '../services/ConfiguracaoService';
import UsuarioService from '../services/UsuarioService';

function Dashboard({ darkTheme, setDarkTheme = () => {} }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [events, setEvents] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [configuracao, setConfiguracao] = useState(null);

  useEffect(() => {
    const currentUser = UsuarioService.getCurrentUser();
    if (!currentUser) return;

    AgendaService.findByUsuarioId(currentUser.id)
      .then((response) => setEvents(response.data || []))
      .catch(error => console.error('Erro ao carregar agendas:', error));

    NotificacaoService.findByUsuarioId(currentUser.id)
      .then((response) => setNotificacoes(response.data))
      .catch(error => console.error('Erro ao carregar notificacoes:', error));

    ConfiguracaoService.findByUsuarioId(currentUser.id)
      .then((response) => setConfiguracao(response.data))
      .catch(error => console.error('Erro ao carregar configuracoes:', error));
  }, []);

  const user = UsuarioService.getCurrentUser();
  const userName = user?.nome || 'Usuario';
  const firstName = userName.split(' ')[0] || 'usuario';
  const userEmail = user?.email || '';
  const userInitials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(name => name[0])
    .join('')
    .toUpperCase() || 'TH';
  const todayDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  const getLocalDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayKey = getLocalDateKey();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = getLocalDateKey(tomorrow);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.slice(0, 5);
  };

  const getEventDateTime = (event) => {
    const date = event.dataAgenda || todayKey;
    const time = event.hora || '00:00:00';
    return new Date(`${date}T${time}`);
  };

  const activeEvents = events
    .filter(event => (event.statusAgenda || 'ativo').toLowerCase() !== 'concluido')
    .sort((a, b) => getEventDateTime(a) - getEventDateTime(b));

  const todayEvents = activeEvents.filter(event => event.dataAgenda === todayKey);
  const nextTask = activeEvents.find(event => {
    const eventDate = event.dataAgenda || '';
    return eventDate >= tomorrowKey;
  });

  const handleThemeChange = (isDark) => {
    setDarkTheme(isDark);
  };

  const handleThemeToggle = () => {
    handleThemeChange(!darkTheme);
  };

  const saveConfiguracao = (changes) => {
    const currentUser = UsuarioService.getCurrentUser();
    if (!currentUser) return;

    const updated = {
      ...(configuracao || {}),
      ...changes,
      usuarioId: configuracao?.usuarioId || currentUser.id,
      formatoHora: configuracao?.formatoHora || '24'
    };

    setConfiguracao(updated);
    if (configuracao?.id) {
      ConfiguracaoService.update(configuracao.id, updated)
        .then(r => setConfiguracao(r.data));
    } else {
      ConfiguracaoService.create(updated)
        .then(r => setConfiguracao(r.data));
    }
  };

  return (
    <div className={`dashboard-container ${darkTheme ? 'dark-theme' : ''}`}>
      <button
        className={`menu-toggle ${showSidebar ? 'open' : ''}`}
        onClick={() => setShowSidebar(!showSidebar)}
        type="button"
        aria-label="Abrir menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <button
        className={`dashboard-theme-toggle ${darkTheme ? 'active' : ''}`}
        onClick={handleThemeToggle}
        type="button"
        aria-label={darkTheme ? 'Ativar modo claro' : 'Ativar modo escuro'}
        title={darkTheme ? 'Modo claro' : 'Modo escuro'}
      >
        <span className="theme-toggle-track">
          <span className="theme-toggle-thumb"></span>
        </span>
        <span className="theme-toggle-label">{darkTheme ? 'Claro' : 'Escuro'}</span>
      </button>

      <aside className={`sidebar ${showSidebar ? 'show' : ''}`}>
        <div className="dashboard-logo">
          <div className="logo-mark"></div>
          <span className="logo-text">TaskHub</span>
        </div>

        <div className="nav-section-label">Menu</div>
        <nav className="sidebar-content">
          <button className="sidebar-item active" type="button" onClick={() => window.location.href = '/?page=dashboard'}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h5v-5h4v5h5v-9.5"/></svg>
            </span>
            <span className="sidebar-label">Home</span>
          </button>

          <button className="sidebar-item" type="button" onClick={() => window.location.href = '/?page=agenda'}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 9h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
            </span>
            <span className="sidebar-label">Agenda</span>
          </button>

          <button className="sidebar-item" type="button" onClick={() => setShowNotifications(true)}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 4-2 5-2 6h16c0-1-2-2-2-6"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
            </span>
            <span className="sidebar-label">Notificações</span>
            {notificacoes.length > 0 && <span className="badge">{notificacoes.length}</span>}
          </button>

          <button className="sidebar-item" type="button" onClick={() => setShowSettings(true)}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V19a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H5a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V5a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v0a1.6 1.6 0 0 0 1.5 1H19a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>
            </span>
            <span className="sidebar-label">Configurações</span>
          </button>

          <button className="sidebar-item" type="button" onClick={() => window.location.href = '/?page=perfil'}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6"/></svg>
            </span>
            <span className="sidebar-label">Perfil</span>
          </button>

          <button className="sidebar-item" type="button" onClick={() => window.location.href = '/?page=home'}>
            <span className="sidebar-label">Sair</span>
          </button>
        </nav>

        <div className="sidebar-spacer"></div>

        <div className="sidebar-user">
          <span className="avatar">{userInitials}</span>
          <div className="info">
            <div className="name">{userName}</div>
            <div className="email">{userEmail}</div>
          </div>
        </div>
      </aside>

      <main className={`dashboard-content ${showSidebar ? 'sidebar-open' : ''}`}>
        <div className="dashboard-header">
          <div className="date">{todayDate}</div>
          <h1>Olá, {firstName}</h1>
          <p>Aqui está um resumo rápido do seu dia.</p>
        </div>

        <div className="dashboard-stack">
          <section className="panel">
            <div className="panel-head">
              <h2>Hoje</h2>
              <span>{todayEvents.length ? `${todayEvents.length} compromisso${todayEvents.length > 1 ? 's' : ''}` : ''}</span>
            </div>
            <div className="today-list">
              {todayEvents.map((event) => (
                <div className="event-row" key={event.id}>
                  <div className="event-bar" style={{ backgroundColor: event.cor || '#2F5FD8' }}></div>
                  <span className="event-time">{formatTime(event.hora)}</span>
                  <div className="event-info">
                    <div className="title">{event.titulo}</div>
                    {event.descricao && <div className="meta">{event.descricao}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="next-task">
            <span className="eyebrow"><span className="dot"></span> Próxima tarefa</span>
            {nextTask ? (
              <>
                <h3>{nextTask.titulo}</h3>
                <div className="when">
                  {formatDate(nextTask.dataAgenda)}{nextTask.hora ? ` · ${formatTime(nextTask.hora)}` : ''}
                </div>
                {nextTask.descricao && <p className="next-task-description">{nextTask.descricao}</p>}
              </>
            ) : (
              <div className="next-task-blank" aria-label="Proxima tarefa vazia"></div>
            )}
            
            
          </section>

          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => window.location.href = '/?page=agenda'} type="button">
              + Nova Atividade
            </button>
          </div>
        </div>
      </main>

      {showSettings && (
        <div className="event-overlay">
          <div className="settings-modal">
            <div className="settings-header">
              <h2>Configurações</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)} type="button">x</button>
            </div>

            <div className="settings-body">
              <div className="settings-section">
                <h3>Preferências</h3>
                <div className="setting-item">
                  <label>Tema:</label>
                  <select
                    className="setting-select"
                    value={darkTheme ? 'dark' : 'light'}
                    onChange={(e) => {
                      const isDark = e.target.value === 'dark';
                      handleThemeChange(isDark);
                      saveConfiguracao({ tema: e.target.value });
                    }}
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Privacidade</h3>
                <div className="privacy-item">
                  <label>Mostrar email</label>
                  <input
                    type="checkbox"
                    checked={configuracao?.mostrarEmail || false}
                    onChange={(e) => {
                      saveConfiguracao({ mostrarEmail: e.target.checked });
                    }}
                  />
                </div>
                <div className="privacy-item">
                  <label>Receber notificações</label>
                  <input
                    type="checkbox"
                    checked={configuracao?.receberEmail !== false}
                    onChange={(e) => {
                      saveConfiguracao({ receberEmail: e.target.checked });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="event-overlay">
          <div className="notifications-modal">
            <div className="notifications-header">
              <h2>Notificações</h2>
              <div className="notifications-controls">
                <button
                  className={`toggle-notifications-btn ${notificationsEnabled ? 'enabled' : 'disabled'}`}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  type="button"
                >
                  {notificationsEnabled ? 'Desativar' : 'Ativar'}
                </button>
                <button className="close-btn" onClick={() => setShowNotifications(false)} type="button">x</button>
              </div>
            </div>

            <div className="notifications-body">
              {notificacoes.length > 0 ? (
                notificacoes.map(n => (
                  <div key={n.id} className="notification-item">
                    <div className="notification-content">
                      <div className="notification-title">{n.statusNotificacao}</div>
                      <div className="notification-text">{n.mensagem}</div>
                      <div className="notification-time">{new Date(n.dataEnvio).toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="notification-empty">
                  <div className="empty-text">Você está em dia!</div>
                  <div className="empty-subtext">Nenhuma notificação pendente</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
