import React, { useState, useEffect } from 'react';
import './Perfil.css';
import UsuarioService from '../services/UsuarioService';

function Perfil({ darkTheme }) {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
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
      foto: foto || ''
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
      setForgotError('As senhas não coincidem.');
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
      <button className={`menu-toggle ${showSidebar ? 'open' : ''}`} onClick={() => setShowSidebar(!showSidebar)}>
        ☰
      </button>

      <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-item" onClick={() => window.location.href = '/?page=dashboard'}>
            <div className="sidebar-label">Home</div>
          </div>
          <div className="sidebar-item" onClick={() => window.location.href = '/?page=agenda'}>
            <div className="sidebar-label">Agenda</div>
          </div>
          <div className={`sidebar-item ${activeSection === 'dados' ? 'active' : ''}`} onClick={() => setActiveSection('dados')}>
            <div className="sidebar-label">Dados pessoais</div>
          </div>
          <div className="sidebar-item" onClick={() => window.location.href = '/?page=home'}>
            <div className="sidebar-label">Sair</div>
          </div>
        </div>
      </div>

      <main className={`perfil-content ${showSidebar ? 'sidebar-open' : ''}`}>
        <section className="perfil-card">
          <div className="perfil-hero">
            <div className="perfil-avatar">
              <div className="avatar-circle" onClick={() => setShowPhotoOptions(true)}>
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Foto de perfil" className="profile-image" />
                ) : (
                  <span>{userData.nome.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button className="photo-action" type="button" onClick={() => setShowPhotoOptions(true)}>
                Alterar foto
              </button>
            </div>

            <div className="perfil-info">
              <span className="perfil-kicker">Meu perfil</span>
              <h2>{userData.nome || 'Usuário'}</h2>
              <p>{userData.email || 'usuario@email.com'}</p>
            </div>

          </div>

          {showPhotoOptions && (
            <div className="photo-options-overlay" onClick={() => setShowPhotoOptions(false)}>
              <div className="photo-options-menu" onClick={(e) => e.stopPropagation()}>
                <div className="photo-option" onClick={handleChangePhoto}>Alterar foto</div>
                <div className="photo-option" onClick={() => { saveProfilePhoto(null); setShowPhotoOptions(false); }}>Remover foto</div>
              </div>
            </div>
          )}

          <div className="perfil-panel">
            <div className="panel-header">
              <div>
                <h3>Dados pessoais</h3>
                <p>Mantenha suas informações principais atualizadas.</p>
              </div>
            </div>

            <div className="perfil-fields">
              <div className="field-group">
                <label>Nome</label>
                <input type="text" value={userData.nome} onChange={(e) => setUserData({ ...userData, nome: e.target.value })} />
              </div>
              <div className="field-group">
                <label>Email</label>
                <input type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                <button className="perfil-forgot-link" type="button" onClick={() => setShowForgot(true)}>Esqueci a senha</button>
              </div>
            </div>

            <div className="perfil-actions">
              <button className="save-btn" onClick={handleSavePersonalData}>Salvar alterações</button>
            </div>
          </div>
        </section>
      </main>

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
