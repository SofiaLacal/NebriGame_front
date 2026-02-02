import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"
import SimpleHeader from '../../components/SimpleHeader/SimpleHeader';


function Login() {

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    contrasenna: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    const res = await fetch(`${apiUrl}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className='background-login'>
      <SimpleHeader/>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Inicia Sesión</h1>
            <p>Pon tu usuario y contraseña para entrar</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contrasenna">Contraseña</label>
              <input
                type="password"
                id="contrasenna"
                name="contrasenna"
                value={formData.contrasenna}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="form-footer">
              <a href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
             {/* MODIFICAR ESTO */}
            </div>
            

            <button type="submit" className="btn-primary">
              Iniciar Sesión
            </button>

            <div className="auth-switch">
              <p>¿No tienes una cuenta?</p>
              <button 
                type="button" 
                onClick={goToRegister}
                className="btn-link"
              >
                Regístrate aquí
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;