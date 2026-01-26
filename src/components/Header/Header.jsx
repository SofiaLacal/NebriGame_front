import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Tv, Gift, Percent, User, Heart, ShoppingCart } from 'lucide-react';
import './Header.css';
import logo from "../../../public/logo.png"

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
        </Link>

        {/* Links principales */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}> Principal </Link>
          </li>
          <li> 
            <Link to="/productos" className={location.pathname === '/products' ? 'active' : ''}> <Gamepad2 size={18} /> Juegos </Link>
          </li>
          <li>
            <Link to="/productos" className={location.pathname === '/consolas' ? 'active' : ''}><Tv size={18} /> Consolas </Link>
          </li>
          <li>
            <Link to="/productos" className={location.pathname === '/merchandising' ? 'active' : ''}><Gift size={18} /> Merchandising </Link>
          </li>
          <li>
            <Link to="/ofertas" className={location.pathname === '/ofertas' ? 'active' : ''}> <Percent size={18} /> Ofertas </Link>
          </li>
        </ul>

          {/* Links de usuario (derecha) */}
        <ul className="nav-links nav-links-right">
          <li>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}> <User size={24} /></Link>
          </li>
          <li>
            <Link to="/wishlist" className={location.pathname === '/wishlist' ? 'active' : ''}><Heart size={24} /></Link>
          </li>
          <li>
            <Link to="/carrito" className={location.pathname === '/carrito' ? 'active' : ''}><ShoppingCart size={24} /></Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
