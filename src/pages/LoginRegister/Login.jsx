import Header from "../../components/Header/Header";
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div>
      <Header />

      <div className="login">

        <h1> PAGINA DE LOGIN </h1>
        
        <button>Iniciar sesión</button>

        <p>
          ¿No estás registrado? Regístrate aquí: <Link to="/register">REGISTRO</Link>
        </p> 

      </div>
      
    </div>
  )
}

export default Login