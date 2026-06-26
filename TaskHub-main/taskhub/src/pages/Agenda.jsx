import { useState, useEffect } from 'react';
import './Agenda.css';
import AgendaService from '../services/AgendaService';
import TarefaService from '../services/TarefaService';
import UsuarioService from '../services/UsuarioService';

function Agenda({ darkTheme }) {
  const [events, setEvents] = useState([]);

  const inferImageMimeType = (base64) => {
    if (!base64) return 'image/jpeg';
    if (base64.startsWith('iVBORw0KGgo')) return 'image/png';
    if (base64.startsWith('/9j/')) return 'image/jpeg';
    if (base64.startsWith('R0lGOD')) return 'image/gif';
    if (base64.startsWith('UklGR')) return 'image/webp';
    return 'image/jpeg';
  };

  const isChecklistItemCompleted = (status) => {
    const normalized = String(status || '').toLowerCase();
    return normalized === 'concluido' || normalized === 'concluida' || normalized === 'completed' || normalized === 'done';
  };

  const mapTaskToChecklistItem = (task) => ({
    id: task.id,
    text: task.descricao || '',
    completed: isChecklistItemCompleted(task.statusTarefa),
    statusTarefa: task.statusTarefa,
  });

  const mapAgendaToEvent = (agenda, checklist = []) => ({
    id: agenda.id,
    title: agenda.titulo,
    date: agenda.dataAgenda,
    time: agenda.hora,
    description: agenda.descricao,
    color: agenda.cor || '#00193a',
    icon: '',
    checklist,
    image: agenda.arquivo ? `data:${inferImageMimeType(agenda.arquivo)};base64,${agenda.arquivo}` : null,
    statusAgenda: agenda.statusAgenda,
  });

  const buildChecklistPayload = (agendaId, item) => ({
    agendaId,
    dataVencimento: null,
    antecedenciaNotificacao: null,
    descricao: item.text,
    statusTarefa: item.completed ? 'concluido' : 'pendente',
    cor: null,
    arquivo: null,
  });

  const saveChecklistForEvent = async (agendaId, checklist = []) => {
    const validItems = checklist.filter((item) => item.text && item.text.trim());
    const savedItems = await Promise.all(validItems.map(async (item) => {
      const payload = buildChecklistPayload(agendaId, item);
      const response = item.id
        ? await TarefaService.update(item.id, payload)
        : await TarefaService.create(payload);

      return mapTaskToChecklistItem(response.data);
    }));

    return savedItems;
  };

  useEffect(() => {
    const user = UsuarioService.getCurrentUser();
    if (user) {
      AgendaService.findByUsuarioId(user.id)
        .then(async (response) => {
          const mapped = await Promise.all(response.data.map(async (agenda) => {
            try {
              const tasksResponse = await TarefaService.findByAgendaId(agenda.id);
              return mapAgendaToEvent(agenda, tasksResponse.data.map(mapTaskToChecklistItem));
            } catch (error) {
              console.error(`Erro ao carregar checklist da agenda ${agenda.id}:`, error);
              return mapAgendaToEvent(agenda);
            }
          }));
          setEvents(mapped);
        })
        .catch(error => console.error('Erro ao carregar agendas:', error));
    }
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [eventForm, setEventForm] = useState({
    title: '', date: '', time: '', description: '', checklist: [], image: null, color: '#1a73e8', icon: ''
  });
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, eventId: null });
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventColors = {
    purple: '#c684d1ff',
    violet: '#8b5cf6',
    pink: '#e961ddff',
    rose: '#fb7185',
    blue: '#7badeeff',
    sky: '#38bdf8',
    cyan: '#22d3ee',
    teal: '#2dd4bf',
    green: '#87ec8cff',
    emerald: '#34d399',
    lime: '#a3e635',
    yellow: '#ffc15eff',
    amber: '#f59e0b',
    orange: '#f0a739ff',
    red: '#f35b5bff',
    slate: '#64748b'
  };

  const handleAddEvent = () => {
    if (eventForm.title && eventForm.date) {
      const user = UsuarioService.getCurrentUser();
      if (!user || !user.id) {
        alert('Erro: Usuário não identificado. Por favor, faça login novamente.');
        return;
      }

      // Garantir que a hora esteja no formato HH:mm:ss esperado pelo LocalTime do Java
      const formattedTime = eventForm.time ? (eventForm.time.length === 5 ? `${eventForm.time}:00` : eventForm.time) : "00:00:00";

      const data = {
        usuarioId: user.id,
        titulo: eventForm.title,
        dataAgenda: eventForm.date,
        hora: formattedTime,
        descricao: eventForm.description,
        statusAgenda: 'ativo',
        cor: eventForm.color || '#1a73e8',
        arquivo: eventForm.image ? eventForm.image.split(',')[1] : null,
      };

      if (eventForm.id) {
        AgendaService.update(eventForm.id, data)
          .then(async (response) => {
            const checklist = await saveChecklistForEvent(response.data.id, eventForm.checklist);
            // Atualiza a lista com os dados retornados do servidor
            const updatedEvent = {
              ...eventForm,
              id: response.data.id,
              date: response.data.dataAgenda,
              time: response.data.hora,
              checklist,
              image: response.data.arquivo ? `data:${inferImageMimeType(response.data.arquivo)};base64,${response.data.arquivo}` : eventForm.image
            };
            setEvents(events.map(e => e.id === eventForm.id ? updatedEvent : e));
            setShowModal(false);
          })
          .catch(error => {
            console.error('Erro ao atualizar:', error);
            alert('Erro ao atualizar evento: ' + (error.response?.data?.message || error.message));
          });
      } else {
        AgendaService.create(data)
          .then(async (response) => {
            const checklist = await saveChecklistForEvent(response.data.id, eventForm.checklist);
            // Adiciona o novo evento com o ID gerado pelo banco
            const newEvent = {
              ...eventForm,
              id: response.data.id,
              date: response.data.dataAgenda,
              time: response.data.hora,
              checklist,
              image: response.data.arquivo ? `data:${inferImageMimeType(response.data.arquivo)};base64,${response.data.arquivo}` : eventForm.image
            };
            setEvents([...events, newEvent]);
            setShowModal(false);
          })
          .catch(error => {
            console.error('Erro ao criar:', error);
            alert('Erro ao criar evento: ' + (error.response?.data?.message || error.message));
          });
      }
      // Resetar formulário após sucesso ou tentar novamente
      setEventForm({ title: '', date: '', time: '', description: '', checklist: [], image: null, color: '#1a73e8', icon: '' });
    } else {
      alert('Por favor, preencha o título e a data.');
    }
  };

  const handleEventRightClick = (e, eventId) => {
    e.preventDefault(); e.stopPropagation();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, eventId });
  };

  const deleteEvent = async (eventId) => {
    if (!eventId) return;

    const eventToDelete = events.find(e => e.id === eventId);
    const confirmed = window.confirm(`Excluir "${eventToDelete?.title || 'este evento'}"?`);
    if (!confirmed) {
      setContextMenu({ show: false, x: 0, y: 0, eventId: null });
      return;
    }

    try {
      const checklist = eventToDelete?.checklist || [];
      await Promise.all(
        checklist
          .filter(item => item.id)
          .map(item => TarefaService.remove(item.id))
      );

      await AgendaService.remove(eventId);
      setEvents(currentEvents => currentEvents.filter(e => e.id !== eventId));
      setShowEventDetails(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('Erro ao excluir evento: ' + (error.response?.data?.message || error.message));
    } finally {
      setContextMenu({ show: false, x: 0, y: 0, eventId: null });
    }
  };

  const changeEventColor = (eventId, color) => {
    const eventToUpdate = events.find(e => e.id === eventId);
    if (eventToUpdate) {
      const data = {
        usuarioId: UsuarioService.getCurrentUser().id,
        titulo: eventToUpdate.title,
        dataAgenda: eventToUpdate.date,
        hora: eventToUpdate.time.length === 5 ? `${eventToUpdate.time}:00` : eventToUpdate.time,
        descricao: eventToUpdate.description,
        statusAgenda: eventToUpdate.statusAgenda || 'ativo',
        cor: color,
        arquivo: eventToUpdate.image ? eventToUpdate.image.split(',')[1] : null
      };

      AgendaService.update(eventId, data)
        .then(() => {
          setEvents(events.map(e => e.id === eventId ? { ...e, color } : e));
        })
        .catch(error => {
          console.error('Erro ao atualizar cor:', error);
          alert('Erro ao salvar a nova cor no servidor.');
        });
    }
    setContextMenu({ show: false, x: 0, y: 0, eventId: null });
  };

  const closeContextMenu = () => setContextMenu({ show: false, x: 0, y: 0, eventId: null });


  const handleEventClick = (e, event) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const updateEventChecklistItem = (eventId, itemIndex, completed) => {
    const eventToUpdate = events.find(event => event.id === eventId);
    const itemToUpdate = eventToUpdate?.checklist?.[itemIndex];

    setEvents(events.map(event => {
      if (event.id === eventId) {
        const updatedChecklist = event.checklist.map((item, index) => index === itemIndex ? { ...item, completed } : item);
        return { ...event, checklist: updatedChecklist };
      }
      return event;
    }));
    if (selectedEvent && selectedEvent.id === eventId) {
      const updatedChecklist = selectedEvent.checklist.map((item, index) => index === itemIndex ? { ...item, completed } : item);
      setSelectedEvent({ ...selectedEvent, checklist: updatedChecklist });
    }

    if (itemToUpdate?.id) {
      TarefaService.update(itemToUpdate.id, buildChecklistPayload(eventId, { ...itemToUpdate, completed }))
        .catch(error => console.error('Erro ao atualizar item do checklist:', error));
    }
  };

  const editEvent = () => { setEventForm(selectedEvent); setShowEventDetails(false); setShowModal(true); };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setEventForm({ ...eventForm, image: e.target.result });
      reader.readAsDataURL(file);
    }
  };

  const addChecklistItem = () => setEventForm({ ...eventForm, checklist: [...eventForm.checklist, { text: '', completed: false }] });

  const updateChecklistItem = (index, field, value) => {
    const newChecklist = [...eventForm.checklist];
    newChecklist[index][field] = value;
    setEventForm({ ...eventForm, checklist: newChecklist });
  };

  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
    const days = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) days.push({ day: prevMonthLastDay - i, type: 'prev' });
    for (let day = 1; day <= daysInMonth; day++) days.push({ day, type: 'current' });
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) days.push({ day, type: 'next' });
    return days;
  };

  const formatDate = (dayObj) => {
    const date = new Date(currentYear, currentMonth, dayObj.day);

    if (dayObj.type === 'prev') {
      date.setMonth(currentMonth - 1);
    }

    if (dayObj.type === 'next') {
      date.setMonth(currentMonth + 1);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const getEventsForDay = (dayObj) => events.filter(e => e.date === formatDate(dayObj));

  const handleDayClick = (dayObj) => {
    if (dayObj?.day) { setEventForm({ ...eventForm, date: formatDate(dayObj) }); setShowModal(true); }
  };

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const today = new Date();
  const goToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const isTodayCell = (dayObj) => {
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return formatDate(dayObj) === todayKey;
  };

  return (
    <div className={`agenda-container ${darkTheme ? 'dark-theme' : ''}`} onClick={closeContextMenu}>
      <header className="agenda-site-header">
        <nav className="agenda-nav">
          <button className="agenda-logo" type="button" onClick={() => window.location.href = '/?page=dashboard'}>
            <span className="agenda-logo-mark" aria-hidden="true"></span>
            Taskhub
          </button>
          <div className="agenda-nav-controls">
            <button className="agenda-btn-today" type="button" onClick={goToday}>Hoje</button>
            <div className="agenda-month-nav">
              <button onClick={prevMonth} className="agenda-nav-btn" type="button" aria-label="Mês anterior">‹</button>
              <span className="agenda-month-label">{monthNames[currentMonth]} {currentYear}</span>
              <button onClick={nextMonth} className="agenda-nav-btn" type="button" aria-label="Próximo mês">›</button>
            </div>
          </div>
          <button className="agenda-btn-new" type="button" onClick={() => { setEventForm({ ...eventForm, date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}` }); setShowModal(true); }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            <span>Novo evento</span>
          </button>
        </nav>
      </header>

      <div className="agenda-page">
      <div className="calendar">
        <div className="calendar-header">
          <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
        </div>
        <div className="calendar-grid">
          {getDaysInMonth().map((dayObj, index) => (
            <div
              key={index}
              className={`calendar-day ${dayObj.type === 'current' ? 'active' : 'other-month'} ${isTodayCell(dayObj) ? 'today' : ''}`}
              onClick={() => handleDayClick(dayObj)}
            >
              <span className="day-number">{dayObj.day}</span>
              <div className="day-events">
                {getEventsForDay(dayObj).map(event => (
                  <div
                    key={event.id}
                    className="event-preview"
                    style={{ backgroundColor: event.color || '#1a73e8' }}
                    onClick={(e) => handleEventClick(e, event)}
                    onContextMenu={(e) => handleEventRightClick(e, event.id)}
                  >
                    {event.icon && <span className="event-icon">{event.icon}</span>}
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      <footer className="agenda-footer">
        <div className="agenda-footer-inner">
          <span>© 2026 Marco</span>
          <span>Feito para quem cuida do próprio tempo.</span>
        </div>
      </footer>

      {showModal && (
        <div className="event-overlay">
          <div className="event-form">
            <div className="form-header">
              <input type="text" placeholder="Adicionar título" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="title-input" />
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-body">
              <div className="form-field">
                <div className="field-icon"></div>
                <div className="field-content">
                  <div className="datetime-row">
                    <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="date-input" />
                    <div className="field-divider" aria-hidden="true"></div>
                    <input type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="time-input" />
                  </div>
                </div>
              </div>
              <div className="event-color-row">
                <span className="event-section-label">Cor</span>
                <div className="event-color-dots">
                  {["#2F5FD8", "#1A9B6C", "#D94235", "#8A9EC2"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`event-color-dot ${eventForm.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEventForm({ ...eventForm, color })}
                      aria-label={`Selecionar cor ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div className="form-field">
                <div className="field-icon"></div>
                <div className="field-content">
                  <textarea placeholder="Adicionar descrição" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="description-input" />
                </div>
              </div>
              <div className="form-field">
                <div className="field-icon"></div>
                <div className="field-content">
                  <div className="checklist-header">
                    <span>Checklist</span>
                    <button type="button" onClick={addChecklistItem} className="add-item-btn">+</button>
                  </div>
                  {eventForm.checklist.map((item, index) => (
                    <div key={index} className="checklist-item">
                      <input type="checkbox" checked={item.completed} onChange={(e) => updateChecklistItem(index, 'completed', e.target.checked)} />
                      <input type="text" placeholder="Adicionar item" value={item.text} onChange={(e) => updateChecklistItem(index, 'text', e.target.value)} className="checklist-text" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-field">
                <div className="field-icon"></div>
                <div className="field-content">
                  <div className="attachment-header">
                    <span>Anexos</span>
                    <label className="file-upload-btn">
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{display: 'none'}} />
                      Adicionar arquivo
                    </label>
                  </div>
                  {eventForm.image && (
                    <div className="attachment-preview">
                      <div className="image-container">
                        <img src={eventForm.image} alt="Preview" className="image-preview" />
                        <button type="button" onClick={() => setEventForm({ ...eventForm, image: null })} className="delete-image-btn" title="Remover imagem">×</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="form-footer">
              <button className="save-btn" onClick={handleAddEvent}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {showEventDetails && selectedEvent && (
        <div className="event-overlay">
          <div className="event-details">
            <div className="details-header">
              <div className="event-color" style={{ backgroundColor: selectedEvent.color || '#1a73e8' }}></div>
              <h2 className="event-title">{selectedEvent.title}</h2>
              <div className="header-actions">
                <button className="edit-btn" onClick={editEvent}>Editar</button>
                <button className="delete-btn" onClick={() => deleteEvent(selectedEvent.id)}>Excluir</button>
                <button className="close-btn" onClick={() => setShowEventDetails(false)}>×</button>
              </div>
            </div>
            <div className="details-body">
              {selectedEvent.date && (
                <div className="detail-item left-aligned">
                  <span className="detail-label">Data:</span>
                  <span className="detail-value">{selectedEvent.date.split('-').reverse().join('/')}</span>
                </div>
              )}
              {selectedEvent.time && (
                <div className="detail-item left-aligned">
                  <span className="detail-label">Horário:</span>
                  <span className="detail-value">{selectedEvent.time}</span>
                </div>
              )}
              {selectedEvent.description && (
                <div className="detail-item left-aligned">
                  <span className="detail-label">Descrição:</span>
                  <p className="detail-description">{selectedEvent.description}</p>
                </div>
              )}
              {selectedEvent.checklist && selectedEvent.checklist.length > 0 && (
                <div className="detail-item left-aligned">
                  <span className="detail-label">Checklist:</span>
                  <div className="detail-checklist">
                    {selectedEvent.checklist.map((item, index) => (
                      <div key={index} className="checklist-detail-item">
                        <input type="checkbox" checked={item.completed} onChange={(e) => updateEventChecklistItem(selectedEvent.id, index, e.target.checked)} className="detail-checkbox" />
                        <span className={item.completed ? 'completed-text' : ''}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedEvent.image && (
                <div className="detail-item left-aligned">
                  <span className="detail-label">Anexo:</span>
                  <img src={selectedEvent.image} alt="Anexo" className="detail-image" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {contextMenu.show && (
        <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }} onClick={(e) => e.stopPropagation()}>
          <div className="context-menu-item delete" onClick={(e) => { e.stopPropagation(); deleteEvent(contextMenu.eventId); }}>Excluir evento</div>
          <div className="context-menu-divider"></div>
          <div className="context-menu-section">
            <div className="context-menu-title">Alterar cor</div>
            <div className="color-options">
              {Object.entries(eventColors).map(([name, color]) => (
                <div key={name} className="color-option" style={{ backgroundColor: color }} onClick={() => changeEventColor(contextMenu.eventId, color)} title={name}></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agenda;
