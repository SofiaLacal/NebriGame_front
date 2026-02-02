import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from "../../components/SimpleHeader/SimpleHeader"
import "./Register.css"

function Register() {
  
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    emailConfirmar: '',
    contrasenna: '',
    contrasennaConfirmar: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    const envioForm = {
      nombre: formData.nombre,
      apellido1: formData.apellidos,
      apellido2: "",
      email: formData.email,
      contrasenna: formData.contrasenna,
    }
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    const res = await fetch(`${apiUrl}/usuarios/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envioForm)
    });
    const data = res.json();
    console.log(envioForm);
    if (data.success) {
      navigate('/login');
    } else {
      setError(data.message);
    }
  };

  return (
    <div className='background-login'>
      <SimpleHeader/>
      <div className="auth-container">
        <div className="auth-card">

          <div className="auth-header">
            <h1>Crear cuenta</h1>
            <p>Rellena el formulario para registrarte</p>
          </div>
          {error && <div className="error-message">{error}</div>}
        
          <form onSubmit={handleSubmit} className="auth-form">

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre <span className="must-do">*</span></label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellidos">Apellidos <span className="must-do">*</span></label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="Apellidos"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email <span className="must-do">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailConfirmar">Confirma tu email <span className="must-do">*</span></label>
                <input
                  type="email"
                  id="emailConfirmar"
                  name="emailConfirmar"
                  value={formData.emailConfirmar}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contrasenna">Contraseña <span className="must-do">*</span></label>
                <input
                  type="password"
                  id="contrasenna"
                  name="contrasenna"
                  value={formData.contrasenna}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contrasennaConfirmar">Confirma tu contraseña <span className="must-do">*</span></label>
                <input
                  type="password"
                  id="contrasennaConfirmar"
                  name="contrasennaConfirmar"
                  value={formData.contrasennaConfirmar}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn-primary">
              Registrarse
            </button>

            <p className="must-do-p">* Campos obligatorios</p>

            <div className="auth-switch">
              <p>¿Ya tienes una cuenta?</p>
              <button 
                type="button" 
                onClick={goToLogin}
                className="btn-link"
              >
                Inicia sesión aquí
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register