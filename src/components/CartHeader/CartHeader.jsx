import { Link, useLocation } from 'react-router-dom';
import { User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './CartHeader.css';
import logo from "../../../public/logo.png"

function CartHeader() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="simple-header-cart">
      <nav className="navbar-cart">
        <Link to="/" className="logo-cart">
          <img src={logo} alt="Logo NebriGame" />
        </Link>

        {/* Pasos del checkout como lista ordenada */}
        <div className="checkout-steps-cont">
          <ul className="checkout-steps-cart">
            <li className="step-cart active">
              <div className="step-number-cart">1</div>
              <span>Carro</span>
            </li>
            <li className="step-line-cart" aria-hidden="true"></li>
            <li className="step-cart">
              <div className="step-number-cart">2</div>
              <span>Pago</span>
            </li>
            <li className="step-line-cart" aria-hidden="true"></li>
            <li className="step-cart">
              <div className="step-number-cart">3</div>
              <span>Envío</span>
            </li>
          </ul>
        </div>
        
        {/* Botón hamburguesa (solo visible en móvil) */}
        <button className="menu-toggle-cart" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links de usuario (derecha) */}
        <ul className={`nav-links-right-cart ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''} onClick={toggleMenu}> 
            <User size={24} /><p className="text-menu-cart">Login</p></Link>
          </li>
          <li>
            <Link to="/wishlist" className={location.pathname === '/wishlist' ? 'active' : ''} onClick={toggleMenu}>
            <Heart size={24} /><p className="text-menu-cart">Wishlist</p></Link>
          </li>
          <li>
            <Link to="/carrito" className={location.pathname === '/carrito' ? 'active' : ''} onClick={toggleMenu}>
            <ShoppingCart size={24} /><p className="text-menu-cart">Carrito</p></Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default CartHeader;