import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from "../../components/SimpleHeader/SimpleHeader"
import "./LoginRegister.css"

function Register() {
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login enviado:', formData);
    // Aquí irá la conexión a la BD más tarde
  };

  return (

    <div className='background-login'>
      <SimpleHeader/>
      <div className="auth-container">
        <div className="auth-card">

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="name"
                name="Nombre"
/*                 value={formData.email}
                onChange={handleChange} */
              />
            </div>

            <div className="form-group">
              <label htmlFor="nombre">Apellidos</label>
              <input
                type="text"
                id="surname"
                name="Apellidos"
/*                 value={formData.email}
                onChange={handleChange} */
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
/*                 value={formData.email}
                onChange={handleChange} */
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contrasenna">Contraseña</label>
              <input
                type="password"
                id="contrasenna"
                name="contrasenna"
/*                 value={formData.contrasenna}
                onChange={handleChange} */
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contrasenna">Confirmar contraseña</label>
              <input
                type="password"
                id="contrasenna"
                name="contrasenna"
/*                 value={formData.contrasenna}
                onChange={handleChange} */
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="btn-primary">
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register