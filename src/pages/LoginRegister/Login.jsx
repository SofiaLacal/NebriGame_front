import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./Login.css"
import SimpleHeader from '../../components/SimpleHeader/SimpleHeader';
import useUserStore from '../../stores/userStore';
import { toast } from '../../stores/toastStore';
import Footer from '../../components/Footer/Footer';
import { login } from '../../api/useAuth';


function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const validFrom = ['/carrito', '/wishlist'].includes(from) ? from : null;

  useEffect(() => {
    const user = useUserStore.getState();

    if (user.id) {
      navigate(validFrom || '/', { replace: true });
    }

  }, [navigate, validFrom]);

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
    navigate('/registro');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email === '' || formData.contrasenna === '') {
      toast.error("Por favor, rellena todos los campos");
      return;
    }
    try {
      const data = await login(formData.email, formData.contrasenna);
      useUserStore.setState({
        id: data.usuarioData.id,
        nombre: data.usuarioData.nombre,
        apellido1: data.usuarioData.apellido1,
        apellido2: data.usuarioData.apellido2,
        email: data.usuarioData.email,
        fecha_registro: data.usuarioData.fecha_registro
      });

      toast.success("Sesión iniciada, bienvenido de nuevo " + data.usuarioData.nombre);
      navigate(validFrom || '/', { replace: true });
    } catch (error) {
      toast.error(error.message);
      setFormData({
        email: '',
        contrasenna: ''
      });
    }

      
  };

  return (
    <>
    <div className='background-login'>
      <SimpleHeader/>
      <div className="auth-container-log">
        <div className="auth-card-log">
          <div className="auth-header-log">
            <h1>Inicia sesión</h1>
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
            </div>

            <div className="btn-cont-log">
              <button type="submit" className="btn-primary-log">
                Iniciar Sesión
              </button>
            </div>
           
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