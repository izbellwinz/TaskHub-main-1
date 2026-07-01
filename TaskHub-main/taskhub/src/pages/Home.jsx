import './Home.css';

const days = [
  { n: '31', muted: true }, { n: '1' }, { n: '2', event: true }, { n: '3' }, { n: '4', event: true }, { n: '5' }, { n: '6' },
  { n: '7' }, { n: '8' }, { n: '9' }, { n: '10', event: true }, { n: '11' }, { n: '12' }, { n: '13' },
  { n: '14' }, { n: '15' }, { n: '16' }, { n: '17' }, { n: '18' }, { n: '19' }, { n: '20' },
  { n: '21' }, { n: '22' }, { n: '23' }, { n: '24' }, { n: '25', today: true, event: true }, { n: '26', event: true }, { n: '27' },
  { n: '28' }, { n: '29', event: true }, { n: '30' }, { n: '1', muted: true }, { n: '2', muted: true }, { n: '3', muted: true }, { n: '4', muted: true },
];

const features = [
  ['◷', 'Planner Inteligente', 'Organize seus objetivos em um calendário intuitivo. Visualize seus eventos e nunca mais perca um compromisso.'],
  ['▤', 'Checklist dinâmico', 'Crie listas de tarefas personalizadas para cada evento. Marque seus itens como concluídos e acompanhe seu progresso em tempo real.'],
  ['⊙', 'Anexo multimídia', 'Adicione contexto visual aos seus eventos. Anexe imagens, vídeos e documentos para manter todas as informações importantes em um só lugar.'],
];

const weekCells = [
  ['1', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
  ['2', '', 'Reunião', '', '', 'Entrega'],
  ['3', 'Compras', '', 'Projeto', '', ''],
  ['4', '', '', '', '1:1', ''],
  ['5', 'Revisão', '', '', '', ''],
];

function Home({ setCurrentPage }) {
  const goTo = (page) => setCurrentPage && setCurrentPage(page);

  return (
    <div className='taskhub-home'>
      <header className='home-header'>
        <nav className='home-nav home-container'>
          <button className='home-logo' type='button' onClick={() => goTo('home')}>
            <span className='home-logo-mark' aria-hidden='true' />
            TaskHub
          </button>
          <div className='home-nav-links'>
            <a href='#recursos'>Recursos</a>
            <a href='#semana'>Como funciona</a>
          </div>
          <div className='home-nav-actions'>
            <button className='home-btn home-btn-ghost' type='button' onClick={() => goTo('login')}>Entrar</button>
          </div>
        </nav>
      </header>

      <main className='home-container'>
        <section className='home-hero'>
          <div className='home-hero-grid'>
            <div>
             
              <h1>Organize sua vida com o <em>Taskhub</em>.</h1>
              <p className='home-lead'>TaskHub organiza reuniões, tarefas e compromissos pessoais num só lugar, com organizações que respeitam o seu foco — não só a sua disponibilidade.</p>
              <div className='home-hero-cta'>
                <button className='home-btn home-btn-primary home-btn-large' type='button' onClick={() => goTo('cadastro')}>Criar conta</button>
              </div>
              <div className='home-hero-meta'>
                <div className='home-avatar-stack'><span>JL</span><span>MS</span><span>+</span></div>
                usado por mais de 4 mil pessoas todos os dias
              </div>
            </div>

            <div className='home-calendar-wrap' aria-label='Calendário de junho de 2026'>
              <div className='home-calendar-head'>
                <div className='home-calendar-title'>Junho <span>2026</span></div>
                <div className='home-calendar-nav'>
                  <button aria-label='mês anterior' type='button'>‹</button>
                  <button aria-label='próximo mês' type='button'>›</button>
                </div>
              </div>
              <div className='home-weekdays'><span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span></div>
              <div className='home-days'>
                {days.map((day, index) => {
                  const classes = ['home-day', day.muted && 'muted', day.today && 'today', day.event && 'has-event'].filter(Boolean).join(' ');
                  return <div key={day.n + '-' + index} className={classes}>{day.n}{day.event && <div className='home-evt' />}</div>;
                })}
              </div>
              <div className='home-calendar-footer'>
                <div className='home-agenda-item'><div className='home-agenda-bar' /><span className='home-agenda-time'>09:30</span><span>Revisão de projeto com a equipe</span></div>
                <div className='home-agenda-item'><div className='home-agenda-bar alt' /><span className='home-agenda-time'>14:00</span><span>Compras</span></div>
              </div>
            </div>
          </div>
        </section>
        <section className='home-section' id='recursos'>
          <div className='home-section-head'>
            <div className='home-section-eyebrow'>Recursos</div>
            <h2>Menos tempo organizando o calendário, mais tempo para você.</h2>
            <p>Cada detalhe do TaskHub existe para tirar uma decisão pequena das suas mãos — para que sobre energia para as grandes.</p>
          </div>
          <div className='home-feature-grid'>
            {features.map(([icon, title, text]) => (
              <article className='home-feature-card' key={title}>
                <div className='home-feature-icon'>{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className='home-section' id='semana'>
          <div className='home-showcase'>
            <div>
              <div className='home-section-eyebrow'>Visão do mês</div>
              <h2>Veja seu mês inteiro sem perder o que importa no dia.</h2>
              <p className='home-desc'>O TaskHub destaca compromissos fixos e deixa sua rotina mais simples.</p>
              <div className='home-showcase-list'>
                <div className='home-item'><span className='home-check'>✓</span>Arraste para mover um compromisso para outro dia</div>
                <div className='home-item'><span className='home-check'>✓</span>Compromissos importantes ganham destaque automático</div>
                <div className='home-item'><span className='home-check'>✓</span>Alterne entre dia, semana e mês com um clique</div>
              </div>
            </div>
            <div className='home-week-card'>
              <div className='home-week-card-head'><span></span><span>Mês atual</span></div>
              <div className='home-week-grid'>
                {weekCells.flatMap((row, rowIndex) => row.map((cell, cellIndex) => {
                  const isHead = rowIndex === 0;
                  const isTime = cellIndex === 0 && rowIndex > 0;
                  const classes = ['home-cell', isHead && 'head', isTime && 'time', cell && !isHead && !isTime && 'block', cell === 'Entrega' && 'accent'].filter(Boolean).join(' ');
                  return <div key={rowIndex + '-' + cellIndex} className={classes}>{cell}</div>;
                }))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='home-footer'>
        <div className='home-container'>
          <div className='home-footer-grid'>
            <div className='home-footer-brand'>
              <div className='home-logo'><span className='home-logo-mark' aria-hidden='true' />TaskHub</div>
              <p>O calendário que organiza o seu tempo em torno do que realmente importa.</p>
            </div>
            <div className='home-footer-col'><h4>Produto</h4><a href='#recursos'>Recursos</a><a href='#precos'>Funcionamento</a><a href='#semana'>Integrações</a><a href='#semana'>Aplicativo mobile</a></div>
            <div className='home-footer-col'><h4>Empresa</h4><button type='button' onClick={() => goTo('sobre')}>Sobre</button><a href='#'>Carreiras</a><a href='#'>Imprensa</a><a href='#'>Contato</a></div>
            <div className='home-footer-col'><h4>Suporte</h4><a href='#'>Central de ajuda</a><a href='#'>Comunidade</a><a href='#'>Status do sistema</a><a href='#'>Privacidade</a></div>
          </div>
          <div className='home-footer-bottom'><span>© 2026 TaskHub. Todos os direitos reservados.</span><span>Feito para quem cuida do próprio tempo.</span></div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
