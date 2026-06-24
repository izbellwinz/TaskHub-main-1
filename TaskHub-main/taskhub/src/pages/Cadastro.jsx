import { useState } from 'react';
import './Cadastro.css';
import UsuarioService from '../services/UsuarioService';

function Cadastro({ setCurrentPage, darkTheme }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
 
 const handleSubmit = (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert('Senha não reconhecida');
    return;
  }

  console.log('Tentando cadastrar:', { nome: formData.nome, email: formData.email });
  
  UsuarioService.register(formData.nome, formData.email, formData.password)
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
    <div className={`cadastro-container ${darkTheme ? 'dark-theme' : ''}`}>
      <div className="cadastro-card">
        <div className="cadastro-logo">
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
        <div className="cadastro-header">
          <h1>Cadastrar com E-mail</h1>
          <p>Preencha os dados para criar sua conta</p>
        </div>
        
        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              
              required
            />
          </div>
          
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirmar Senha</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="cadastro-btn">Cadastrar</button>
        </form>
        
        <div className="cadastro-footer">
          <p>Já tem uma conta? <span className="link" onClick={() => setCurrentPage('login')}>Faça login</span></p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;