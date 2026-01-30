import { Link, useLocation } from 'react-router-dom';
import { Home, User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
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
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo NebriGame" />
        </div>

         {/* Botón hamburguesa (solo visible en móvil) */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links principales */}
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={toggleMenu}> 
            <Home size={18} />
            </Link>
          </li>
        </ul>

          {/* Links de usuario (derecha) */}
        <ul className={`nav-links nav-links-right ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''} onClick={toggleMenu}> 
            <User size={24} /></Link>
          </li>
          <li>
            <Link to="/wishlist" className={location.pathname === '/wishlist' ? 'active' : ''} onClick={toggleMenu}>
            <Heart size={24} /></Link>
          </li>
          <li>
            <Link to="/carrito" className={location.pathname === '/carrito' ? 'active' : ''} onClick={toggleMenu}>
            <ShoppingCart size={24} /></Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default SimpleHeader;


