import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import useUserStore from '../../stores/userStore';
import { toast } from '../../stores/toastStore';
import './UsuarioDropdown.css';

function UsuarioDropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const nombre = useUserStore((state) => state.nombre);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (e) => {

      if (!e.target.closest('.usuario-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <li className="usuario-container">
      {nombre ? (
        <>
          <span 
            className={`hola-usuario ${isDropdownOpen ? 'active' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <User size={24} /> ¡Hola, {nombre}!
          </span>
          {isDropdownOpen && (
            <div className="usuario-dropdown">
              <Link to="/perfil" onClick={() => setIsDropdownOpen(false)}>
                Mi cuenta
              </Link>
              <Link to="/pedidos" onClick={() => setIsDropdownOpen(false)}>
                Mis pedidos
              </Link>
              <button onClick={() => { 
                logout(); 
                toast.success("Sesión cerrada, hasta luego " + nombre); 
                setIsDropdownOpen(false); 
                navigate('/'); 
              }}>
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