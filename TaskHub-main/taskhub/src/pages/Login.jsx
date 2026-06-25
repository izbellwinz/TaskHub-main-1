import { useState } from 'react';
import './Login.css';
import UsuarioService from '../services/UsuarioService';

function Login({ setCurrentPage, darkTheme }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [forgotStep, setForgotStep] = useState(null);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassData, setNewPassData] = useState({ novaSenha: '', confirmarSenha: '' });
  const [forgotMsg, setForgotMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    UsuarioService.login(formData.email, formData.password).then(
      () => setCurrentPage('dashboard'),
      (error) => {
        const respMessage = error.response?.data?.message || error.message || error.toString();
        alert('Erro no login: ' + respMessage);
      }
    );
  };

  const handleForgotEmail = (e) => {
    e.preventDefault();
    setForgotMsg('');
    UsuarioService.findAll()
      .then((res) => {
        const existe = res.data.some((u) => u.email === forgotEmail);
        if (!existe) {
          setForgotMsg('Email nao encontrado.');
        } else {
          setForgotStep('senha');
        }
      })
      .catch(() => setForgotMsg('Erro ao verificar email.'));
  };

  const handleResetSenha = (e) => {
    e.preventDefault();
    setForgotMsg('');
    if (newPassData.novaSenha !== newPassData.confirmarSenha) {
      setForgotMsg('As senhas nao coincidem.');
      return;
    }
    if (newPassData.novaSenha.length < 6) {
      setForgotMsg('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    UsuarioService.resetSenha(forgotEmail, newPassData.novaSenha)
      .then(() => {
        setForgotStep(null);
        setForgotEmail('');
        setNewPassData({ novaSenha: '', confirmarSenha: '' });
        alert('Senha redefinida com sucesso! Faca login.');
      })
      .catch((error) => {
        setForgotMsg(error.response?.data?.message || 'Erro ao redefinir senha.');
      });
  };

  const closeForgot = () => {
    setForgotStep(null);
    setForgotEmail('');
    setNewPassData({ novaSenha: '', confirmarSenha: '' });
    setForgotMsg('');
  };

  return (
    <div className={`login-page ${darkTheme ? 'dark-theme' : ''}`}>
      <header className="login-site-header">
        <nav className="login-nav">
          <button className="login-logo" type="button" onClick={() => setCurrentPage('home')}>
            <span className="login-logo-mark" aria-hidden="true"></span>
            Taskhub
          </button>
          <p className="login-nav-aux">
            Ainda não tem conta?{' '}
            <button type="button" onClick={() => setCurrentPage('cadastro')}>
              Criar conta
            </button>
          </p>
        </nav>
      </header>

      <main className="login-main">
        <div className="login-auth-layout">
          <aside className="login-auth-panel">
            <div className="login-auth-panel-top">
              <div className="login-logo login-logo-panel">
                <span className="login-logo-mark" aria-hidden="true"></span>
                Taskhub
              </div>
              <h2>
                Bem-vindo de <em>volta.</em>
              </h2>
              <p>Sua agenda continua exatamente onde voce deixou - organizada, clara e pronta para o seu dia.</p>
            </div>

            <div className="login-auth-panel-quote">
              
            </div>
          </aside>

          <section className="login-auth-form-wrap">
            <div className="login-auth-heading">
            
              
              <h1>Entre na sua conta</h1>
              <p>Use seu e-mail e senha para continuar.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">


              <div className="login-field">
                <label htmlFor="login-email">E-mail</label>
                <input
                  type="email"
                  id="login-email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="login-field">
                <div className="login-field-row">
                  <label htmlFor="login-senha">Senha</label>
                  <button className="login-forgot-link" type="button" onClick={() => setForgotStep('email')}>
                    Esqueci a senha
                  </button>
                </div>
                <input
                  type="password"
                  id="login-senha"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <button className="login-btn login-btn-primary login-btn-full" type="submit">
                Entrar
              </button>

              <p className="login-auth-footer-note">
                Não tem conta?{' '}
                <button type="button" onClick={() => setCurrentPage('cadastro')}>
                  Criar conta
                </button>
              </p>
            </form>
          </section>
        </div>
      </main>

      <footer className="login-site-footer">
        <div className="login-footer-bottom">
          <span>© 2026 Taskhub</span>
          <a href="#">Privacidade</a>
          <a href="#">Termos de uso</a>
          <a href="#">Suporte</a>
        </div>
      </footer>

      {forgotStep && (
        <div className="login-forgot-overlay" onClick={closeForgot}>
          <div className="login-forgot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="login-forgot-close" type="button" onClick={closeForgot}>×</button>

            {forgotStep === 'email' && (
              <>
                <h2>Redefinir senha</h2>
                <p>Digite o e-mail cadastrado na sua conta.</p>
                <form onSubmit={handleForgotEmail} className="login-modal-form">
                  <div className="login-field">
                    <label htmlFor="forgot-email">E-mail</label>
                    <input
                      type="email"
                      id="forgot-email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  {forgotMsg && <p className="login-forgot-error">{forgotMsg}</p>}
                  <button type="submit" className="login-btn login-btn-primary login-btn-full">Continuar</button>
                </form>
              </>
            )}

            {forgotStep === 'senha' && (
              <>
                <h2>Nova senha</h2>
                <p>Defina uma nova senha para <strong>{forgotEmail}</strong>.</p>
                <form onSubmit={handleResetSenha} className="login-modal-form">
                  <div className="login-field">
                    <label htmlFor="nova-senha">Nova senha</label>
                    <input
                      type="password"
                      id="nova-senha"
                      value={newPassData.novaSenha}
                      onChange={(e) => setNewPassData({ ...newPassData, novaSenha: e.target.value })}
                      required
                    />
                  </div>
                  <div className="login-field">
                    <label htmlFor="confirmar-senha">Confirmar senha</label>
                    <input
                      type="password"
                      id="confirmar-senha"
                      value={newPassData.confirmarSenha}
                      onChange={(e) => setNewPassData({ ...newPassData, confirmarSenha: e.target.value })}
                      required
                    />
                  </div>
                  {forgotMsg && <p className="login-forgot-error">{forgotMsg}</p>}
                  <button type="submit" className="login-btn login-btn-primary login-btn-full">Redefinir senha</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
