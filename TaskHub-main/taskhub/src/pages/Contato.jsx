import { useState } from 'react';
import './Contato.css';
import ContatoService from '../services/ContatoService';
import UsuarioService from '../services/UsuarioService';

function Contato({ darkTheme }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = UsuarioService.getCurrentUser();
    const data = {
      usuarioId: user ? user.id : null,
      nome: formData.nome,
      email: formData.email,
      assunto: formData.assunto,
    };
    ContatoService.create(data)
      .then(() => {
        alert('Mensagem enviada com sucesso!');
        setFormData({ nome: '', email: '', assunto: '' });
      })
      .catch(error => alert('Erro ao enviar mensagem: ' + (error.response?.data?.message || error.message)));
  };

  return (
    <div className={`contato ${darkTheme ? 'dark-theme' : ''}`}>
      <div className="contato-hero">
        <div className="contato-header">
          <h1>Fale Conosco</h1>
          <p>Estamos aqui para ajudar você</p>
        </div>
      </div>
      <div className="contato-container">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Nome"
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Email"
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <select
                value={formData.assunto}
                onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                required
                className="form-input"
              >
                <option value="">Selecione um assunto</option>
                <option value="suporte">Suporte Técnico</option>
                <option value="feedback">Feedback</option>
                <option value="sugestao">Sugestão</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            

            <button type="submit" className="submit-btn">Enviar</button>
          </form>
        </div>
      </div>
  
  );
}

export default Contato;