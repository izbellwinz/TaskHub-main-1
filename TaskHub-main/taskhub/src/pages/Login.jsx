import { useState } from 'react';
import './Login.css';
import UsuarioService from '../services/UsuarioService';

function Login({ setCurrentPage, darkTheme }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [forgotStep, setForgotStep] = useState(null); // null | 'email' | 'senha'
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassData, setNewPassData] = useState({ novaSenha: '', confirmarSenha: '' });
  const [forgotMsg, setForgotMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    UsuarioService.login(formData.email, formData.password).then(
      () => setCurrentPage('dashboard'),
      (error) => {
        const respMessage = (error.response?.data?.message) || error.message || error.toString();
        alert('Erro no login: ' + respMessage);
      }
    );
  };

  const handleForgotEmail = (e) => {
    e.preventDefault();
    setForgotMsg('');
    UsuarioService.findAll().then((res) => {
      const existe = res.data.some(u => u.email === forgotEmail);
      if (!existe) {
        setForgotMsg('Email não encontrado.');
      } else {
        setForgotStep('senha');
      }
    }).catch(() => setForgotMsg('Erro ao verificar email.'));
  };

  const handleResetSenha = (e) => {
    e.preventDefault();
    setForgotMsg('');
    if (newPassData.novaSenha !== newPassData.confirmarSenha) {
      setForgotMsg('As senhas não coincidem.');
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
        alert('Senha redefinida com sucesso! Faça login.');
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
    <div className={`login-container ${darkTheme ? 'dark-theme' : ''}`}>
      <div className="login-card">
        <div className="login-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
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
          <span>TaskHub</span>
        </div>
        <div className="login-header">
          <h1>Entrar com Email</h1>
          <p>Digite suas credenciais para acessar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="login-btn">Entrar</button>
        </form>

        <div className="login-footer">
          <p>
            <span className="link" onClick={() => setForgotStep('email')}>Esqueci a senha</span>
          </p>
          <p>Não tem uma conta? <span className="link" onClick={() => setCurrentPage('cadastro')}>Cadastre-se</span></p>
        </div>
      </div>

      {forgotStep && (
        <div className="forgot-overlay" onClick={closeForgot}>
          <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="forgot-close" onClick={closeForgot}>✕</button>

            {forgotStep === 'email' && (
              <>
                <h2>Redefinir Senha</h2>
                <p>Digite o email cadastrado na sua conta.</p>
                <form onSubmit={handleForgotEmail}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  {forgotMsg && <p className="forgot-error">{forgotMsg}</p>}
                  <button type="submit" className="login-btn">Continuar</button>
                </form>
              </>
            )}

            {forgotStep === 'senha' && (
              <>
                <h2>Nova Senha</h2>
                <p>Defina uma nova senha para <strong>{forgotEmail}</strong></p>
                <form onSubmit={handleResetSenha}>
                  <div className="form-group">
                    <label>Nova Senha</label>
                    <input
                      type="password"
                      value={newPassData.novaSenha}
                      onChange={(e) => setNewPassData({ ...newPassData, novaSenha: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Senha</label>
                    <input
                      type="password"
                      value={newPassData.confirmarSenha}
                      onChange={(e) => setNewPassData({ ...newPassData, confirmarSenha: e.target.value })}
                      required
                    />
                  </div>
                  {forgotMsg && <p className="forgot-error">{forgotMsg}</p>}
                  <button type="submit" className="login-btn">Redefinir Senha</button>
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