import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import { toast } from '../../stores/toastStore';
import SimpleHeader from "../../components/SimpleHeader/SimpleHeader";
import Footer from '../../components/Footer/Footer';
import "./Register.css"


function Register() {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    emailConfirmar: '',
    contrasenna: '',
    contrasennaConfirmar: ''
  });

  useEffect(() => {
    const user = useUserStore.getState();
    
    if (user.id) {
      navigate('/');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError(null);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    // Validación emails
    if (formData.email !== formData.emailConfirmar) {
      setError('Los emails no coinciden');
      return;
    }
    
    // Validación contraseñas
    if (formData.contrasenna !== formData.contrasennaConfirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const envioForm = {
      nombre: formData.nombre,
      apellido1: formData.apellido1,
      apellido2: formData.apellido2,
      email: formData.email,
      contrasenna: formData.contrasenna,
    };

    try {
      const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
      const res = await fetch(`${apiUrl}/usuarios/registro`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(envioForm)
      });
      
      const data = await res.json();
      
      if (data.success) {
        
        useUserStore.setState({
          id: data.usuario.id,
          nombre: data.usuario.nombre,
          apellido1: data.usuario.apellido1,
          apellido2: data.usuario.apellido2,
          email: data.usuario.email
        });

        toast.success("Cuenta creada correctamente, bienvenido " + data.usuario.nombre);
        navigate('/');

      } else {
        setError(data.message || 'Error al registrarse');
        toast.error(data.message || 'Error al registrarse');
      }

    } catch (error) {
      console.error('Error en el registro:', error);
      setError(error.message || 'Error al registrarse');
      toast.error("Error al registrarse");
      return;
    }
  };

  return (

    <>
      <div className='background-register'>
        <SimpleHeader/>
        <div className="auth-container-reg">
          <div className="auth-card-reg">

            <div className="auth-header-reg">
              <h1>Crear cuenta</h1>
              <p>Rellena el formulario para registrarte</p>
            </div>
          
            <form onSubmit={handleSubmit} className="auth-form-reg">

              <div className="form-row-reg">
                <div className="form-group-reg">
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
              </div>

              <div className="form-row-reg">
                <div className="form-group-reg">
                  <label htmlFor="apellidos">Apellido<span className="must-do"> *</span></label>
                  <input
                    type="text"
                    id="apellido1"
                    name="apellido1"
                    value={formData.apellido1}
                    onChange={handleChange}
                    placeholder="Primer apellido"
                    required
                  />
                </div>
                  <div className="form-group-reg">
                    <label htmlFor="apellidos">Apellido</label>
                    <input
                      type="text"
                      id="apellido2"
                      name="apellido2"
                      value={formData.apellido2}
                      onChange={handleChange}
                      placeholder="Segundo apellido"
                    />
                </div>
              </div>

              <div className="form-row-reg">
                <div className="form-group-reg">
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

                <div className="form-group-reg">
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

              <div className="form-row-reg">
                <div className="form-group-reg">
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

                <div className="form-group-reg">
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
              
              {error && <div className="error-message-reg">{error}</div>}

              <div className="btn-cont-reg">
                <button type="submit" className="btn-primary-reg">
                  Registrarse
                </button>
              </div>

              <p className="must-do-p">* Campos obligatorios</p>

              <div className="auth-switch-reg">
                <p>¿Ya tienes una cuenta?</p>
                <button 
                  type="button" 
                  onClick={goToLogin}
                  className="btn-link-reg"
                >
                  Inicia sesión aquí
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

export default Register