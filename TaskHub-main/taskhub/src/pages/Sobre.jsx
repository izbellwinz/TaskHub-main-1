import './Sobre.css';

function Sobre({ darkTheme }) {
  return (
    <div className={`sobre ${darkTheme ? 'dark-theme' : ''}`}>
      <div className="sobre-container">
        <div className="sobre-header">
          <h1>Sobre o TaskHub</h1>
          <p>Uma plataforma completa para organizar sua vida digital</p>
        </div>

        <div className="recursos-section">
          <h2>Recursos</h2>
          <div className="recursos-grid">
            <div className="recurso-item">
              <h3>Planner Inteligente</h3>
              <p>Organize seus compromissos em um calendário visual e intuitivo. Visualize seus eventos e nunca mais perca um compromisso importante.</p>
            </div>

            <div className="recurso-item">
              <h3>Checklist Dinâmico</h3>
              <p>Crie listas de tarefas personalizadas para cada evento. Marque itens como concluídos e acompanhe seu progresso em tempo real.</p>
            </div>
          </div>
          
          <div className="recurso-item recurso-centered">
            <h3>Anexos Multimídia</h3>
            <p>Adicione contexto visual aos seus eventos com imagens e documentos. Mantenha tudo organizado em um só lugar.</p>
          </div>
        </div>

        <div className="diferenciais-section">
          <h2>Por que escolher o TaskHub?</h2>
          <div className="diferenciais-list">
            <div className="diferencial-item">
              <div className="diferencial-number">1</div>
              <div className="diferencial-content">
                <h3>Interface Moderna</h3>
                <p>Design clean e intuitivo que facilita o uso diário</p>
              </div>
            </div>
            
            <div className="diferencial-item">
              <div className="diferencial-number">2</div>
              <div className="diferencial-content">
                <h3>Tudo Integrado</h3>
                <p>Planner, checklist e anexos em uma única plataforma</p>
              </div>
            </div>
            
            <div className="diferencial-item">
              <div className="diferencial-number">3</div>
              <div className="diferencial-content">
                <h3>Fácil de Usar</h3>
                <p>Criado para ser simples e eficiente no dia a dia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sobre;