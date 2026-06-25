import { useMemo, useState } from 'react';
import './Cadastro.css';
import UsuarioService from '../services/UsuarioService';

function Cadastro({ setCurrentPage, darkTheme }) {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    password: '',
    termos: false,
  });

  const passwordScore = useMemo(() => {
    let score = 0;
    if (formData.password.length >= 8) score += 1;
    if (/[A-Z]/.test(formData.password)) score += 1;
    if (/[0-9]/.test(formData.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;
    return score;
  }, [formData.password]);

  const strengthColors = ['#D93A2F', '#E08B30', '#2F5FD8', '#1A7F5A'];
  const strengthLabels = ['Fraca', 'Razoavel', 'Boa', 'Forte'];
  const strengthColor = strengthColors[passwordScore - 1] || '#D93A2F';
  const strengthLabel = formData.password
    ? strengthLabels[passwordScore - 1] || 'Fraca'
    : 'Use letras, numeros e simbolos para uma senha forte.';

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.termos) {
      alert('Aceite os termos para continuar');
      return;
    }

    const nomeCompleto = (formData.nome + ' ' + formData.sobrenome).trim();

    console.log('Tentando cadastrar:', { nome: nomeCompleto, email: formData.email });

    UsuarioService.register(nomeCompleto, formData.email, formData.password)
      .then(() => UsuarioService.login(formData.email, formData.password))
      .then(() => {
        console.log('Cadastro e login realizados com sucesso');
        sessionStorage.setItem('isFirstAccess', 'true');
        setCurrentPage('dashboard');
      })
      .catch((error) => {
        console.error('Erro no cadastro:', error);
        const respMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        alert('Erro no cadastro: ' + respMessage);
      });
  };

  return (
    <div className={'cadastro-page ' + (darkTheme ? 'dark-theme' : '')}>
      <header className='cadastro-site-header'>
        <nav className='cadastro-nav'>
          <button className='cadastro-logo' type='button' onClick={() => setCurrentPage('home')}>
            <span className='cadastro-logo-mark' aria-hidden='true'></span>
            Taskhub
          </button>
          <p className='cadastro-nav-aux'>
            Ja tem conta?{' '}
            <button type='button' onClick={() => setCurrentPage('login')}>Entrar</button>
          </p>
        </nav>
      </header>

      <main className='cadastro-main'>
        <div className='cadastro-auth-layout'>
          <aside className='cadastro-auth-panel'>
            <div>
              <div className='cadastro-logo cadastro-logo-panel'>
                <span className='cadastro-logo-mark' aria-hidden='true'></span>
                Taskhub
              </div>
              <h2>Comece a organizar o seu <em>tempo</em>.</h2>
            </div>

            <div className='cadastro-benefits'>
              <div className='cadastro-benefit'>
                <div className='cadastro-benefit-icon'>◷</div>
                <div className='cadastro-benefit-text'>
                  <strong>Planner Inteligente</strong>
                  <span>Organize seus objetivos em um calendário intuitivo. Visualize seus eventos e nunca mais perca um compromisso.</span>
                </div>
              </div>
              <div className='cadastro-benefit'>
                <div className='cadastro-benefit-icon'>⇄</div>
                <div className='cadastro-benefit-text'>
                  <strong>Checklist dinâmico</strong>
                  <span>Crie listas de tarefas personalizadas para cada evento. Marque seus itens como concluídos e acompanhe seu progresso em tempo real.</span>
                </div>
              </div>
              <div className='cadastro-benefit'>
                <div className='cadastro-benefit-icon'>⊙</div>
                <div className='cadastro-benefit-text'>
                  <strong>Anexo multimídia</strong>
                  <span>Adicione contexto visual aos seus eventos. Anexe imagens, vídeos e documentos para manter todas as informações importantes em um só lugar.</span>
                </div>
              </div>
            </div>

            <div className='cadastro-panel-badge'>Mais de 4 mil pessoas usam o Marco todo dia</div>
          </aside>

          <section className='cadastro-auth-form-wrap'>
            <div className='cadastro-auth-heading'>
              <h1>Crie sua conta</h1>
              <p>Leva menos de um minuto para configurar.</p>
            </div>

            <form onSubmit={handleSubmit} className='cadastro-form'>
              <div className='cadastro-divider'><span>ou preencha seus dados</span></div>

              <div className='cadastro-form-row'>
                <div className='cadastro-field'>
                  <label htmlFor='nome'>Nome</label>
                  <input type='text' id='nome' placeholder='Seu nome' autoComplete='given-name' value={formData.nome} onChange={(e) => updateField('nome', e.target.value)} required />
                </div>
                <div className='cadastro-field'>
                  <label htmlFor='sobrenome'>Sobrenome</label>
                  <input type='text' id='sobrenome' placeholder='Seu sobrenome' autoComplete='family-name' value={formData.sobrenome} onChange={(e) => updateField('sobrenome', e.target.value)} required />
                </div>
              </div>

              <div className='cadastro-field'>
                <label htmlFor='email'>E-mail</label>
                <input type='email' id='email' placeholder='seu@email.com' autoComplete='email' value={formData.email} onChange={(e) => updateField('email', e.target.value)} required />
              </div>

              <div className='cadastro-password-strength'>
                <label className='cadastro-strength-label' htmlFor='senha'>Senha</label>
                <div className='cadastro-strength-input-wrap'>
                  <input type='password' id='senha' placeholder='Minimo 8 caracteres' autoComplete='new-password' value={formData.password} onChange={(e) => updateField('password', e.target.value)} required minLength={8} />
                </div>
                <div className='cadastro-strength-bars'>
                  {[0, 1, 2, 3].map((bar) => (
                    <div className={'cadastro-strength-bar ' + (bar < passwordScore ? 'on' : '')} style={bar < passwordScore ? { background: strengthColor } : undefined} key={bar}></div>
                  ))}
                </div>
                <span className='cadastro-strength-hint' style={formData.password ? { color: strengthColor } : undefined}>{strengthLabel}</span>
              </div>

              <div className='cadastro-checkbox-field'>
                <input type='checkbox' id='termos' checked={formData.termos} onChange={(e) => updateField('termos', e.target.checked)} required />
                <label htmlFor='termos'>Concordo com os <a href='#'>Termos de uso</a> e a <a href='#'>Politica de privacidade</a> do Marco.</label>
              </div>

              <button className='cadastro-btn cadastro-btn-primary cadastro-btn-full' type='submit'>Criar conta</button>

              <p className='cadastro-auth-footer-note'>
                Já tem conta?{' '}
                <button type='button' onClick={() => setCurrentPage('login')}>Entrar</button>
              </p>
            </form>
          </section>
        </div>
      </main>

      <footer className='cadastro-site-footer'>
        <div className='cadastro-footer-bottom'>
          <span>© 2026 Taskhub</span>
          <a href='#'>Privacidade</a>
          <a href='#'>Termos de uso</a>
          <a href='#'>Suporte</a>
        </div>
      </footer>
    </div>
  );
}

export default Cadastro;
