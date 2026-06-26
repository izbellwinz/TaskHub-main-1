import './NotificationToast.css';

function NotificationToast({ notifications = [], onClose, onMarkRead }) {
  if (!notifications.length) return null;


  return (
    <div className="notification-toast-stack" aria-live="polite" aria-atomic="false">
      {notifications.map((notification) => (
        <section className={`notification-toast ${notification._variant ? `notification-toast--${notification._variant}` : ''}`} key={notification.id} role="status">

          <div className="notification-toast-header">
            <div>
              <div className="notification-toast-app">TaskHub</div>
              <div className="notification-toast-subtitle">{notification.subtitle}</div>
            </div>
            <button
              type="button"
              className="notification-toast-close"
              onClick={() => onClose(notification.id)}
              aria-label="Fechar notificacao"
            >
              x
            </button>
          </div>
          <div className="notification-toast-body">
            <strong>{notification.title}</strong>
            <span>{notification.dateTime}</span>
            <p>{notification.message}</p>
          </div>
          <div className="notification-toast-actions">
            <button type="button" onClick={() => onMarkRead(notification.id)}>
              Marcar como lida
            </button>
            <button type="button" onClick={() => onClose(notification.id)}>
              Fechar
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

export default NotificationToast;
