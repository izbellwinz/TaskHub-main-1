import './Home.css';
import { useState, useEffect } from 'react';

const ChecklistIllustration = () => (
  <div className="chk-wrapper">
    <div className="chk-card">
      <div className="chk-header">Checklist</div>
      {[
        { label: 'Revisar tarefas', done: true },
        { label: 'Reunião de equipe', done: true },
        { label: 'Enviar relatório', done: false },
        { label: 'Planejar semana', done: false },
      ].map((item, i) => (
        <div key={i} className={`chk-item ${item.done ? 'chk-done' : ''}`}>
          <span className="chk-box">{item.done ? '✓' : ''}</span>
          <span className="chk-label">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const CalendarIllustration = () => (
  <div className="cal-wrapper">
    <div className="cal-bubble cal-bubble-clock">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" fill="white" stroke="#c7d2fe" strokeWidth="1.5"/>
        <circle cx="18" cy="18" r="12" fill="#e0e7ff"/>
        <line x1="18" y1="10" x2="18" y2="18" stroke="#0d1b5e" strokeWidth="2" strokeLinecap="round"/>
        <line x1="18" y1="18" x2="24" y2="21" stroke="#0d1b5e" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="18" cy="18" r="2" fill="#0d1b5e"/>
      </svg>
    </div>
    <div className="cal-bubble cal-bubble-chat-green">
      <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
        <rect width="40" height="30" rx="8" fill="#6ee7b7"/>
        <polygon points="8,30 16,30 8,38" fill="#6ee7b7"/>
        <circle cx="14" cy="15" r="3" fill="white"/>
        <circle cx="20" cy="15" r="3" fill="white"/>
        <circle cx="26" cy="15" r="3" fill="white"/>
      </svg>
    </div>
    <div className="cal-bubble cal-bubble-chat-teal">
      <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
        <rect width="40" height="30" rx="8" fill="#5eead4"/>
        <polygon points="8,30 16,30 8,38" fill="#5eead4"/>
        <rect x="10" y="10" width="20" height="3" rx="1.5" fill="white" opacity="0.8"/>
        <rect x="10" y="16" width="14" height="3" rx="1.5" fill="white" opacity="0.6"/>
      </svg>
    </div>
    <div className="cal-bubble cal-bubble-user">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="1.5"/>
        <circle cx="18" cy="14" r="5" fill="#93c5fd"/>
        <path d="M8 28c0-5.5 4.5-9 10-9s10 3.5 10 9" fill="#93c5fd"/>
      </svg>
    </div>

    <div className="cal-main">
      <div className="cal-top-bar">
        <div className="cal-pin"></div>
        <div className="cal-pin"></div>
      </div>
      <div className="cal-header-bar"></div>
      <div className="cal-body">
        {[
          ['#0d1b5e','#c7d2fe','#c7d2fe','#c7d2fe','#a5f3fc'],
          ['#c7d2fe','#fde68a','#b45309','#0d1b5e','#c7d2fe'],
          ['#0d1b5e','#fde68a','#b45309','#0d1b5e','#a5f3fc'],
          ['#0d1b5e','#a5f3fc','#c7d2fe','#c7d2fe','#c7d2fe'],
        ].map((row, ri) => (
          <div key={ri} className="cal-row">
            {row.map((color, ci) => (
              <div key={ci} className="cal-cell" style={{ background: color }}></div>
            ))}
          </div>
        ))}
      </div>
    </div>

    <div className="cal-check">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="30" r="28" fill="white" stroke="#bfdbfe" strokeWidth="2" opacity="0.9"/>
        <circle cx="30" cy="30" r="22" fill="#dbeafe" opacity="0.7"/>
        <polyline points="18,30 26,38 42,22" stroke="#0d1b5e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

const features = [
  {
    title: 'Planner Inteligente',
    desc: 'Organize seus compromissos em um calendário visual e intuitivo. Visualize seus eventos e nunca mais perca um compromisso importante.',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <defs>
          <linearGradient id="calendarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3949ab" />
            <stop offset="50%" stopColor="#5c6bc0" />
            <stop offset="100%" stopColor="#7986cb" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3949ab" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect x="4" y="10" width="48" height="42" rx="6" fill="url(#calendarGrad)" opacity="0.1" filter="url(#shadow)"/>
        <rect x="4" y="10" width="48" height="14" rx="6" fill="url(#calendarGrad)"/>
        <rect x="4" y="19" width="48" height="5" fill="url(#calendarGrad)" opacity="0.8"/>
        <rect x="16" y="4" width="6" height="12" rx="3" fill="url(#calendarGrad)" filter="url(#shadow)"/>
        <rect x="34" y="4" width="6" height="12" rx="3" fill="url(#calendarGrad)" filter="url(#shadow)"/>
        <rect x="9"  y="29" width="8" height="7" rx="2" fill="#fde68a" filter="url(#shadow)"/>
        <rect x="20" y="29" width="8" height="7" rx="2" fill="#fde68a" filter="url(#shadow)"/>
        <rect x="31" y="29" width="8" height="7" rx="2" fill="#fde68a" filter="url(#shadow)"/>
        <rect x="42" y="29" width="8" height="7" rx="2" fill="#fde68a" filter="url(#shadow)"/>
        <rect x="9"  y="39" width="8" height="7" rx="2" fill="url(#calendarGrad)" opacity="0.4"/>
        <rect x="20" y="39" width="8" height="7" rx="2" fill="url(#calendarGrad)" opacity="0.4"/>
        <rect x="31" y="39" width="8" height="7" rx="2" fill="url(#calendarGrad)" opacity="0.4"/>
        <circle cx="13" cy="32" r="1.5" fill="white" opacity="0.8"/>
        <circle cx="24" cy="32" r="1.5" fill="white" opacity="0.8"/>
        <circle cx="35" cy="32" r="1.5" fill="white" opacity="0.8"/>
      </svg>
    ),
  },
  {
    title: 'Checklist Dinâmico',
    desc: 'Crie listas de tarefas personalizadas para cada evento. Marque itens como concluídos e acompanhe seu progresso em tempo real.',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <defs>
          <linearGradient id="checklistGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3949ab" />
            <stop offset="50%" stopColor="#5c6bc0" />
            <stop offset="100%" stopColor="#7986cb" />
          </linearGradient>
          <filter id="checkShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3949ab" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect x="12" y="6" width="28" height="40" rx="5" fill="url(#checklistGrad)" filter="url(#checkShadow)"/>
        <rect x="14" y="8" width="24" height="36" rx="3" fill="white" opacity="0.95"/>
        <rect x="16" y="14" width="20" height="3" rx="1.5" fill="url(#checklistGrad)" opacity="0.7"/>
        <rect x="16" y="21" width="20" height="3" rx="1.5" fill="url(#checklistGrad)" opacity="0.7"/>
        <rect x="16" y="28" width="16" height="3" rx="1.5" fill="url(#checklistGrad)" opacity="0.5"/>
        <rect x="16" y="35" width="18" height="3" rx="1.5" fill="url(#checklistGrad)" opacity="0.5"/>
        <circle cx="6" cy="26" r="5" fill="url(#checklistGrad)" opacity="0.2" filter="url(#checkShadow)"/>
        <circle cx="46" cy="26" r="5" fill="url(#checklistGrad)" opacity="0.2" filter="url(#checkShadow)"/>
        <polyline points="3,26 6,29 9,23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="43,26 46,29 49,23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="18" cy="15" r="1" fill="#10b981"/>
        <circle cx="18" cy="22" r="1" fill="#f59e0b"/>
        <circle cx="18" cy="29" r="1" fill="#ef4444"/>
      </svg>
    ),
  },
  {
    title: 'Anexos multimídia',
    desc: 'Adicione contexto visual aos seus eventos com imagens e documentos. Mantenha tudo organizado em um só lugar.',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <defs>
          <linearGradient id="mediaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3949ab" />
            <stop offset="50%" stopColor="#5c6bc0" />
            <stop offset="100%" stopColor="#7986cb" />
          </linearGradient>
          <filter id="mediaShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3949ab" floodOpacity="0.3"/>
          </filter>
        </defs>
        <path d="M26 6C17 6 12 12 12 22v10l-4 4h36l-4-4v-10c0-10-5-16-14-16z" fill="url(#mediaGrad)" filter="url(#mediaShadow)"/>
        <rect x="22" y="42" width="8" height="4" rx="2" fill="url(#mediaGrad)"/>
        <circle cx="40" cy="12" r="6" fill="#fde68a" stroke="#f59e0b" strokeWidth="2" filter="url(#mediaShadow)"/>
        <circle cx="6" cy="22" r="4" fill="url(#mediaGrad)" opacity="0.3" filter="url(#mediaShadow)"/>
        <circle cx="46" cy="30" r="3" fill="url(#mediaGrad)" opacity="0.3" filter="url(#mediaShadow)"/>
        <rect x="18" y="16" width="16" height="12" rx="3" fill="white" opacity="0.95" filter="url(#mediaShadow)"/>
        <circle cx="22" cy="20" r="2" fill="url(#mediaGrad)"/>
        <polygon points="18,25 24,22 28,24 34,22 34,28 18,28" fill="url(#mediaGrad)" opacity="0.7"/>
        <rect x="20" y="30" width="12" height="2" rx="1" fill="url(#mediaGrad)" opacity="0.6"/>
        <rect x="20" y="33" width="8" height="2" rx="1" fill="url(#mediaGrad)" opacity="0.4"/>
        <circle cx="40" cy="12" r="2" fill="white" opacity="0.8"/>
        <path d="M38,12 L40,14 L42,10" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

function Home({ setCurrentPage, darkTheme, setDarkTheme }) {
  const [showSplash, setShowSplash] = useState(true);

  const handleThemeToggle = () => {
    setDarkTheme(!darkTheme);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-content">
            <svg width="100" height="100" viewBox="0 0 36 36" fill="none">
              <rect x="2" y="6" width="24" height="22" rx="4" fill="#0d1b5e" stroke="#1a237e" strokeWidth="1.2"/>
              <rect x="2" y="6" width="24" height="9" rx="4" fill="#0d1b5e"/>
              <rect x="2" y="11" width="24" height="4" fill="#0d1b5e"/>
              <rect x="4" y="14" width="20" height="13" rx="2" fill="white"/>
              <rect x="9" y="3" width="4" height="7" rx="2" fill="white" stroke="#1a237e" strokeWidth="1"/>
              <rect x="15" y="3" width="4" height="7" rx="2" fill="white" stroke="#1a237e" strokeWidth="1"/>
              <rect x="6" y="16" width="4" height="3.5" rx="0.8" fill="#3949ab"/>
              <rect x="11" y="16" width="4" height="3.5" rx="0.8" fill="#0d1b5e" opacity="0.6"/>
              <rect x="6" y="20.5" width="4" height="3.5" rx="0.8" fill="#0d1b5e" opacity="0.6"/>
              <rect x="11" y="20.5" width="4" height="3.5" rx="0.8" fill="#3949ab"/>
              <circle cx="26" cy="26" r="8" fill="white" stroke="#0d1b5e" strokeWidth="2.2"/>
              <circle cx="26" cy="26" r="5.5" fill="white"/>
              <polyline points="22.5,26 25,28.5 29.5,22.5" stroke="#0d1b5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="32" y1="32" x2="34" y2="34" stroke="#0d1b5e" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <h2>TaskHub</h2>
          </div>
        </div>
      )}
      <div className={showSplash ? 'home hidden' : `home`}>
      <button
        className={`home-theme-toggle ${darkTheme ? 'active' : ''}`}
        onClick={handleThemeToggle}
        type="button"
        aria-label={darkTheme ? 'Ativar modo claro' : 'Ativar modo escuro'}
        title={darkTheme ? 'Modo claro' : 'Modo escuro'}
      >
        <span className="home-theme-toggle-track">
          <span className="home-theme-toggle-thumb"></span>
        </span>
        <span className="home-theme-toggle-label">{darkTheme ? 'Claro' : 'Escuro'}</span>
      </button>

      {/* Hero */}
      <section className="hero">
        <div className="hero-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="hero-content">
          <h1>Organize sua vida com o TaskHub</h1>
          <p>Sua agenda digital completa para planejar, organizar e conquistar seus objetivos.</p>
          <button className="cta-button" onClick={() => setCurrentPage('cadastro')}>Começar agora</button>
        </div>
        <div className="hero-image">
          <ChecklistIllustration />
          <CalendarIllustration />
        </div>
      </section>

      {/* Key Features */}
      <section className="features">
        <h2>Recursos</h2>
        <div className="features-container">
          {features.map((f, index) => (
            <div key={f.title} className="feature-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-number">{index + 1}</div>
              <div className="feature-content">
                <div className="feature-icon-wrapper">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}

export default Home;
