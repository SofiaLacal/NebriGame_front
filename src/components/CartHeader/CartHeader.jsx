import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Menu, X } from 'lucide-react';
import UsuarioDropdown from '../UsuarioDropdown/UsuarioDropdown';
import { useState, useEffect } from 'react';
import './CartHeader.css';
import { toast } from '../../stores/toastStore';

function CartHeader({ pasoActual = 1 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.usuario-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cierra el menú móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.navbar-cart')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada, hasta luego " + nombre);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const pasos = [
    { numero: 1, label: 'Carro' },
    { numero: 2, label: 'Envío' },
    { numero: 3, label: 'Pago' },
  ];

  return (
    <header className="simple-header-cart">
      <nav className="navbar-cart">
        <Link to="/" className="logo-cart">
          <img src="/logo.png" alt="Logo NebriGame" />
        </Link>

        {/* Pasos del checkout */}
        <div className="checkout-steps-cont">
          <ul className="checkout-steps-cart">
            {pasos.map((paso, index) => (
              <li
                key={paso.numero}
                className={`step-cart ${pasoActual === paso.numero ? 'active' : ''} ${pasoActual > paso.numero ? 'completed' : ''}`}
              >
                <div className="step-number-cart">{paso.numero}</div>
                <span>{paso.label}</span>
                {index < pasos.length - 1 && (
                  <span className="step-line-cart" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Botón hamburguesa (solo visible en móvil) */}
        <button type="button" className="menu-toggle-cart" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links de usuario (derecha) */}
        <ul className={`nav-links-right-cart ${isMenuOpen ? 'active' : ''}`}>
          <UsuarioDropdown />
          <li>
            <Link
              to="/wishlist"
              className={location.pathname === '/wishlist' ? 'active' : ''}
              onClick={toggleMenu}
            >
              <Heart size={24} />
              <p className="text-menu-cart">Wishlist</p>
            </Link>
          </li>
          <li>
            <Link
              to="/carrito"
              className={location.pathname === '/carrito' ? 'active' : ''}
              onClick={toggleMenu}
            >
              <ShoppingCart size={24} />
              <p className="text-menu-cart">Carrito</p>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default CartHeader;