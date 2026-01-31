import { Link, useLocation } from 'react-router-dom';
import { User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './SimpleHeader.css';
import logo from "../../../public/logo.png"

function SimpleHeader() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="simple-header">
      <nav className="navbar-sh">
        <Link to="/" className="logo-sh">
          <img src={logo} alt="Logo NebriGame" />
        </Link>

        {/* Botón hamburguesa (solo visible en móvil) */}
        <button className="menu-toggle-sh" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links de usuario (derecha) */}
        <ul className={`nav-links-right-sh ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''} onClick={toggleMenu}> 
            <User size={24} /><p className="text-menu-sh">Login</p></Link>
          </li>
          <li>
            <Link to="/wishlist" className={location.pathname === '/wishlist' ? 'active' : ''} onClick={toggleMenu}>
            <Heart size={24} /><p className="text-menu-sh">Wishlist</p></Link>
          </li>
          <li>
            <Link to="/carrito" className={location.pathname === '/carrito' ? 'active' : ''} onClick={toggleMenu}>
            <ShoppingCart size={24} /><p className="text-menu-sh">Carrito</p></Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default SimpleHeader;


