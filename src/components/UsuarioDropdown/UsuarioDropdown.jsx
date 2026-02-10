import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import useUserStore from '../../stores/userStore';
import './UsuarioDropdown.css';

function UsuarioDropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const nombre = useUserStore((state) => state.nombre);
  const logout = useUserStore((state) => state.logout);

  return (
    <li className="usuario-container">
      {nombre ? (
        <>
          <span className="hola-usuario" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <User size={24} /> ¡Hola, {nombre}!
          </span>
          {isDropdownOpen && (
            <div className="usuario-dropdown">
              <Link to="/perfil" onClick={() => setIsDropdownOpen(false)}>
                Mi cuenta
              </Link>
              <button onClick={() => { logout(); setIsDropdownOpen(false); }}>
                Cerrar sesión
              </button>
            </div>
          )}
        </>
      ) : (
        <Link to="/login">
          <User size={24} />
        </Link>
      )}
    </li>
  );
}

export default UsuarioDropdown;