import { useState, useEffect, useMemo, useCallback } from 'react';
import './Dashboard.css';
import AgendaService from '../services/AgendaService';
import NotificacaoService from '../services/NotificacaoService';
import ConfiguracaoService from '../services/ConfiguracaoService';
import UsuarioService from '../services/UsuarioService';
import TarefaService from '../services/TarefaService';

function Dashboard({ darkTheme, setDarkTheme = () => {} }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationLeadMinutes, setNotificationLeadMinutes] = useState(() => {
    const saved = Number(localStorage.getItem('taskhub-notification-lead-minutes'));
    return Number.isFinite(saved) ? Math.min(Math.max(saved, 0), 60) : 30;
  });
  const [activeToasts, setActiveToasts] = useState([]);


  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [configuracao, setConfiguracao] = useState(null);

  useEffect(() => {
    const currentUser = UsuarioService.getCurrentUser();
    if (!currentUser) return;

    AgendaService.findByUsuarioId(currentUser.id)
      .then(async (response) => {
        const loadedEvents = response.data || [];
        setEvents(loadedEvents);

        const loadedTasks = await Promise.all(
          loadedEvents.map((event) =>
            TarefaService.findByAgendaId(event.id)
              .then((taskResponse) => (taskResponse.data || []).map((task) => ({
                ...task,
                agendaTitulo: event.titulo,
              })))
              .catch((error) => {
                console.error(`Erro ao carregar tarefas da agenda ${event.id}:`, error);
                return [];
              })
          )
        );
        setTasks(loadedTasks.flat());
      })
      .catch(error => console.error('Erro ao carregar agendas:', error));

    NotificacaoService.findByUsuarioId(currentUser.id)
      .then((response) => setNotificacoes(response.data))
      .catch(error => console.error('Erro ao carregar notificacoes:', error));

    ConfiguracaoService.findByUsuarioId(currentUser.id)
      .then((response) => {
        setConfiguracao(response.data);
        if (response.data?.receberEmail !== undefined) {
          setNotificationsEnabled(response.data.receberEmail !== false);
        }
      })
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

  const getEventDateTime = useCallback((event) => {
    const date = event.dataAgenda || todayKey;
    const time = event.hora || '00:00:00';
    return new Date(`${date}T${time}`);
  }, [todayKey]);

  const getTaskDateTime = (task) => {
    if (!task.dataVencimento) return null;
    return new Date(task.dataVencimento);
  };

  const getDismissedToastKeys = () => {
    try {
      return JSON.parse(localStorage.getItem('taskhub-dismissed-notifications') || '[]');
    } catch {
      return [];
    }
  };

  const saveDismissedToastKey = (key) => {
    const dismissed = new Set(getDismissedToastKeys());
    dismissed.add(key);
    localStorage.setItem('taskhub-dismissed-notifications', JSON.stringify([...dismissed].slice(-200)));
  };

  const formatDueTime = (date) => date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const activeEvents = useMemo(() => events
    .filter(event => (event.statusAgenda || 'ativo').toLowerCase() !== 'concluido')
    .sort((a, b) => getEventDateTime(a) - getEventDateTime(b)), [events, getEventDateTime]);

  const todayEvents = activeEvents.filter(event => event.dataAgenda === todayKey);
  const nextTask = activeEvents.find(event => {
    const eventDate = event.dataAgenda || '';
    return eventDate >= tomorrowKey;
  });
  const pendingNotificationsCount = notificacoes.filter((notification) => !notification.lida).length + activeToasts.length;

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

  const handleNotificationLeadChange = (value) => {
    const nextValue = Math.min(Math.max(Number(value) || 0, 0), 60);
    setNotificationLeadMinutes(nextValue);
    localStorage.setItem('taskhub-notification-lead-minutes', String(nextValue));
  };

  const toggleNotifications = () => {
    const nextValue = !notificationsEnabled;
    setNotificationsEnabled(nextValue);
    saveConfiguracao({ receberEmail: nextValue });
  };

  const dismissToast = (toastKey) => {
    saveDismissedToastKey(toastKey);
    setActiveToasts((current) => current.filter((toast) => toast.key !== toastKey));
  };

  const markPersistedNotificationAsRead = (notification) => {
    NotificacaoService.update(notification.id, {
      ...notification,
      lida: true,
      statusNotificacao: notification.statusNotificacao || 'enviada',
    })
      .then((response) => {
        setNotificacoes((current) => current.map((item) => item.id === notification.id ? response.data : item));
      })
      .catch((error) => console.error('Erro ao marcar notificacao como lida:', error));
  };

  useEffect(() => {
    if (!notificationsEnabled) {
      setActiveToasts([]);
      return undefined;
    }

    const checkUpcomingItems = () => {
      const now = new Date();
      const dismissed = new Set(getDismissedToastKeys());
      const upcomingEvents = activeEvents
        .map((event) => {
          if (event.notificar === false) return null;

          const dueAt = getEventDateTime(event);
          const diffMinutes = (dueAt - now) / 60000;
          const key = `event-${event.id}-${event.dataAgenda}-${event.hora}`;
          const eventLeadMinutes = Math.min(Math.max(Number(event.antecedenciaNotificacao ?? notificationLeadMinutes) || 0, 0), 60);

          if (diffMinutes < 0 || diffMinutes > eventLeadMinutes || dismissed.has(key)) {
            return null;
          }

          return {
            key,
            type: 'Evento',
            title: event.titulo,
            message: eventLeadMinutes === 0
              ? `Comeca agora, as ${formatDueTime(dueAt)}.`
              : `Comeca as ${formatDueTime(dueAt)}. Aviso configurado para ${eventLeadMinutes} min antes.`,
          };
        })
        .filter(Boolean);

      const upcomingTasks = tasks
        .map((task) => {
          const dueAt = getTaskDateTime(task);
          if (!dueAt) return null;

          const taskLeadMinutes = Math.min(Math.max(Number(task.antecedenciaNotificacao ?? notificationLeadMinutes) || 0, 0), 60);
          const diffMinutes = (dueAt - now) / 60000;
          const key = `task-${task.id}-${task.dataVencimento}`;

          if (diffMinutes < 0 || diffMinutes > taskLeadMinutes || dismissed.has(key)) {
            return null;
          }

          return {
            key,
            type: 'Tarefa',
            title: task.descricao || task.agendaTitulo || 'Tarefa',
            message: `Vence as ${formatDueTime(dueAt)}.`,
          };
        })
        .filter(Boolean);

      setActiveToasts([...upcomingEvents, ...upcomingTasks].slice(0, 3));
    };

    checkUpcomingItems();
    const intervalId = window.setInterval(checkUpcomingItems, 30000);
    return () => window.clearInterval(intervalId);
  }, [notificationsEnabled, notificationLeadMinutes, activeEvents, tasks, getEventDateTime]);

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
            {pendingNotificationsCount > 0 && <span className="badge">{pendingNotificationsCount}</span>}
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
              <button className="settings-close" onClick={() => setShowSettings(false)} type="button" aria-label="Fechar">
                x
              </button>
            </div>

            <div className="settings-body">
              <div className="settings-section">
                <div className="settings-section-label">Preferências</div>
                <div className="setting-row">
                  <label>Tema:</label>
                  <select
                    className="select-tema"
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
                <div className="settings-section-label">Privacidade</div>
                <div className="setting-row">
                  <label>Receber notificações</label>
                  <span className="settings-switch">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={toggleNotifications}
                    />
                    <span className="track"></span>
                    <span className="thumb"></span>
                  </span>
                </div>
                <div className="setting-row notification-minutes-row">
                  <label htmlFor="notification-minutes">Avisar antes</label>
                  <div className="notification-minutes-control">
                    <input
                      id="notification-minutes"
                      type="number"
                      min="0"
                      max="60"
                      value={notificationLeadMinutes}
                      onChange={(e) => handleNotificationLeadChange(e.target.value)}
                    />
                    <span>min</span>
                  </div>
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
                  onClick={toggleNotifications}
                  type="button"
                >
                  {notificationsEnabled ? 'Desativar' : 'Ativar'}
                </button>
                <button className="close-btn" onClick={() => setShowNotifications(false)} type="button">x</button>
              </div>
            </div>

            <div className="notifications-body">
              {activeToasts.length > 0 && (
                <div className="notification-group">
                  <div className="notification-group-title">Agenda</div>
                  {activeToasts.map((toast) => (
                    <div key={toast.key} className="notification-item agenda-notification-item">
                      <div className="notification-content">
                        <div className="notification-title">{toast.type}</div>
                        <div className="notification-text">{toast.title}</div>
                        <div className="notification-time">{toast.message}</div>
                        <button className="notification-read-btn" type="button" onClick={() => dismissToast(toast.key)}>
                          Marcar como lida
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {notificacoes.length > 0 ? (
                notificacoes.map(n => (
                  <div key={n.id} className="notification-item">
                    <div className="notification-content">
                      <div className="notification-title">{n.statusNotificacao}</div>
                      <div className="notification-text">{n.mensagem}</div>
                      <div className="notification-time">{new Date(n.dataEnvio).toLocaleString('pt-BR')}</div>
                      {!n.lida && (
                        <button className="notification-read-btn" type="button" onClick={() => markPersistedNotificationAsRead(n)}>
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : activeToasts.length === 0 ? (
                <div className="notification-empty">
                  <div className="empty-text">Você está em dia!</div>
                  <div className="empty-subtext">Nenhuma notificação pendente</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {activeToasts.length > 0 && (
        <div className="notification-toast-stack" aria-live="polite">
          {activeToasts.map((toast) => (
            <div className="notification-toast" key={toast.key} role="status">
              <div className="notification-toast-bar" aria-hidden="true"></div>
              <div className="notification-toast-content">
                <div className="notification-toast-label">TaskHub - {toast.type}</div>
                <strong>{toast.title}</strong>
                <p>{toast.message}</p>
              </div>
              <button type="button" onClick={() => dismissToast(toast.key)} aria-label="Fechar notificacao">
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
