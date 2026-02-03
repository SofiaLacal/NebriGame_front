import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"
import SimpleHeader from '../../components/SimpleHeader/SimpleHeader';
import useUserStore from '../../stores/userStore';
import Footer from '../../components/Footer/Footer';


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

    useUserStore.setState({
      id: data.usuarioData.id,
      nombre: data.usuarioData.nombre,
      apellido1: data.usuarioData.apellido1,
      apellido2: data.usuarioData.apellido2,
      email: data.usuarioData.email,
      fecha_registro: data.usuarioData.fecha_registro
    });
    if (data.success) {
      console.log(useUserStore.getState());
      navigate('/');
    } else {
      setError(data.message || 'Error al iniciar sesión');
    }
  };

  return (
    <>
    <div className='background-login'>
      <SimpleHeader/>
      <div className="auth-container-log">
        <div className="auth-card-log">
          <div className="auth-header-log">
            <h1>Inicia Sesión</h1>
            <p>Pon tu usuario y contraseña para entrar</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-log">
            <div className="form-group-log">
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

            <div className="form-group-log">
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

            <div className="form-footer-log">
              <a href="#" className="forgot-password-log">
                ¿Olvidaste tu contraseña?
              </a>
             {/* MODIFICAR ESTO */}
            </div>
            

            <button type="submit" className="btn-primary-log">
              Iniciar Sesión
            </button>

            <div className="auth-switch-log">
              <p>¿No tienes una cuenta?</p>
              <button 
                type="button" 
                onClick={goToRegister}
                className="btn-link-log"
              >
                Regístrate aquí
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <Footer/>

   </>
  )
}

export default Login;