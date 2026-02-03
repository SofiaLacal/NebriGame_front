import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Tv, Gift, Percent, User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Header.css';
import logo from "../../../public/logo.png"

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo NebriGame" />
        </Link>

         {/* Botón hamburguesa (solo visible en móvil) */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links principales */}
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={toggleMenu}> 
            Principal </Link>
          </li>
          <li> 
            <Link to="/productos/videojuegos" className={location.pathname.startsWith === '/products/videojuegos' ? 'active' : ''} onClick={toggleMenu}> <Gamepad2 size={18} /> 
            Juegos </Link>
          </li>
          <li>
            <Link to="/productos/consolas" className={location.pathname.startsWith === '/productos/consolas' ? 'active' : ''} onClick={toggleMenu}><Tv size={18} /> 
            Consolas </Link>
          </li>
          <li>
            <Link to="/productos/merchandising" className={location.pathname.startsWith === '/productos/merchandising' ? 'active' : ''} onClick={toggleMenu}><Gift size={18} /> 
            Merchandising </Link>
          </li>
          <li>
            <Link to="/ofertas" className={location.pathname === '/ofertas' ? 'active' : ''} onClick={toggleMenu}> <Percent size={18} /> 
            Ofertas </Link>
          </li>
          
        </ul>

          {/* Links de usuario (derecha) */}
        <ul className={`nav-links-right ${isMenuOpen ? 'active' : ''}`}>
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

export default Header;


