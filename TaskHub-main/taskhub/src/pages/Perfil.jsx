import React, { useState, useEffect } from 'react';
import './Perfil.css';
import UsuarioService from '../services/UsuarioService';

function Perfil({ darkTheme }) {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [activeSection, setActiveSection] = useState('dados');
  const [userData, setUserData] = useState({ nome: '', email: '' });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotData, setForgotData] = useState({ novaSenha: '', confirmarSenha: '' });
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  useEffect(() => {
    const user = UsuarioService.getCurrentUser();
    if (user) {
      setUserData({ nome: user.nome || '', email: user.email || '' });
      setProfilePhoto(user.foto || null);
    }
  }, []);

  const updateCurrentUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const saveProfilePhoto = (foto) => {
    const user = UsuarioService.getCurrentUser();
    if (!user) return;

    setProfilePhoto(foto);
    UsuarioService.update(user.id, {
      nome: userData.nome,
      email: userData.email,
      senha: user.senha,
      foto: foto || '',
    })
      .then((response) => {
        updateCurrentUser({ ...user, ...response.data });
      })
      .catch(error => alert('Erro ao salvar foto: ' + (error.response?.data?.message || error.message)));
  };

  const handleChangePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => saveProfilePhoto(event.target.result);
        reader.readAsDataURL(file);
      }
    };
    input.click();
    setShowPhotoOptions(false);
  };

  const handleSavePersonalData = () => {
    const user = UsuarioService.getCurrentUser();
    if (user) {
      UsuarioService.update(user.id, { nome: userData.nome, email: userData.email, senha: user.senha, foto: profilePhoto || '' })
        .then((response) => {
          alert('Dados atualizados com sucesso!');
          updateCurrentUser({ ...user, ...response.data, ...userData });
        })
        .catch(error => alert('Erro ao atualizar dados: ' + (error.response?.data?.message || error.message)));
    }
  };

  const handleForgotReset = (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    if (forgotData.novaSenha.length < 6) {
      setForgotError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (forgotData.novaSenha !== forgotData.confirmarSenha) {
      setForgotError('As senhas nao coincidem.');
      return;
    }
    const user = UsuarioService.getCurrentUser();
    if (!user) return;
    UsuarioService.resetSenha(user.email, forgotData.novaSenha)
      .then(() => {
        setForgotSuccess('Senha redefinida com sucesso!');
        setForgotData({ novaSenha: '', confirmarSenha: '' });
        localStorage.setItem('user', JSON.stringify({ ...user, senha: forgotData.novaSenha }));
      })
      .catch(error => setForgotError(error.response?.data?.message || 'Erro ao redefinir senha.'));
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotData({ novaSenha: '', confirmarSenha: '' });
    setForgotError('');
    setForgotSuccess('');
  };

  return (
    <div className={`perfil-container ${darkTheme ? 'dark-theme' : ''}`}>
      <header className="perfil-site-header">
        <nav className="perfil-nav">
          <button className="perfil-logo" type="button" onClick={() => window.location.href = '/?page=dashboard'}>
            <span className="perfil-logo-mark" aria-hidden="true"></span>
            Taskhub
          </button>
        </nav>
      </header>

      <main className="perfil-layout">
        <aside className="perfil-sidebar">
          <div className="perfil-sidebar-label">Menu</div>
          <button className="perfil-sidebar-item" type="button" onClick={() => window.location.href = '/?page=dashboard'}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.35" /><rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.35" /><rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.35" /><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.35" /></svg>
            Home
          </button>
          <button className="perfil-sidebar-item" type="button" onClick={() => window.location.href = '/?page=agenda'}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><rect x="1.5" y="2" width="12" height="11.5" rx="1.8" stroke="currentColor" strokeWidth="1.35" /><path d="M5 1v2.5M10 1v2.5M1.5 6.5h12" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" /></svg>
            Agenda
          </button>
          <button className={`perfil-sidebar-item ${activeSection === 'dados' ? 'active' : ''}`} type="button" onClick={() => setActiveSection('dados')}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><circle cx="7.5" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.35" /><path d="M1.5 13c0-2.485 2.686-4.5 6-4.5s6 2.015 6 4.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" /></svg>
            Perfil
          </button>
          <div className="perfil-sidebar-divider"></div>
          <button className="perfil-sidebar-item danger" type="button" onClick={() => window.location.href = '/?page=home'}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M5.5 2H3a1 1 0 00-1 1v9a1 1 0 001 1h2.5M9.5 10.5l3-3-3-3M12.5 7.5H5.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Sair
          </button>
        </aside>

        <section className="perfil-content">
          <div className="perfil-avatar-card">
            <div className="avatar-circle" onClick={() => setShowPhotoOptions(true)}>
              {profilePhoto ? (
                <img src={profilePhoto} alt="Foto de perfil" className="profile-image" />
              ) : (
                <span>{(userData.nome || 'U').charAt(0).toUpperCase()}</span>
              )}
              <div className="avatar-overlay" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 13.5V16h2.5l7.372-7.372-2.5-2.5L2 13.5z" fill="white" /><path d="M15.71 4.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="white" /></svg>
              </div>
            </div>
            <h2 className="perfil-avatar-name">{userData.nome || 'Usuario'}</h2>
            <p className="perfil-avatar-email">{userData.email || 'usuario@email.com'}</p>
            <button className="photo-action" type="button" onClick={() => setShowPhotoOptions(true)}>
              Alterar foto
            </button>
          </div>

          {showPhotoOptions && (
            <div className="photo-options-overlay" onClick={() => setShowPhotoOptions(false)}>
              <div className="photo-options-menu" onClick={(e) => e.stopPropagation()}>
                <button className="photo-option" type="button" onClick={handleChangePhoto}>Alterar foto</button>
                <button className="photo-option" type="button" onClick={() => { saveProfilePhoto(null); setShowPhotoOptions(false); }}>Remover foto</button>
              </div>
            </div>
          )}

          <div className="perfil-form-card">
            <h3 className="perfil-form-title">Dados pessoais</h3>

            <div className="perfil-fields">
              <div className="field-group">
                <label>Nome</label>
                <input type="text" placeholder="Seu nome completo" value={userData.nome} onChange={(e) => setUserData({ ...userData, nome: e.target.value })} />
              </div>
              <div className="field-group">
                <label>Email</label>
                <input type="email" placeholder="seu@email.com" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
              </div>
            </div>

            <div className="perfil-actions">
              <button className="perfil-forgot-link" type="button" onClick={() => setShowForgot(true)}>Esqueci a senha</button>
              <button className="save-btn" onClick={handleSavePersonalData}>Salvar alteracoes</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="perfil-footer">
        <div className="perfil-footer-inner">
          <span>© 2026 Marco</span>
          <span>Feito para quem cuida do proprio tempo.</span>
        </div>
      </footer>

      {showForgot && (
        <div className="forgot-overlay" onClick={closeForgot}>
          <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="forgot-close" onClick={closeForgot}>×</button>
            <h2>Redefinir senha</h2>
            <p>Defina uma nova senha para a sua conta.</p>
            <form onSubmit={handleForgotReset}>
              <div className="field-group">
                <label>Nova senha</label>
                <input type="password" value={forgotData.novaSenha} onChange={(e) => setForgotData({ ...forgotData, novaSenha: e.target.value })} required />
              </div>
              <div className="field-group">
                <label>Confirmar senha</label>
                <input type="password" value={forgotData.confirmarSenha} onChange={(e) => setForgotData({ ...forgotData, confirmarSenha: e.target.value })} required />
              </div>
              {forgotError && <p className="password-error">{forgotError}</p>}
              {forgotSuccess && <p className="password-success">{forgotSuccess}</p>}
              <button type="submit" className="change-password-btn">Redefinir senha</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
