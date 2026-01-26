import { Link } from 'react-router-dom';
import './Header.css';
import logo from "../../../public/logo.png"

function Header() {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo NebriGame" />
        </div>
        <ul className="nav-links">
          <li><Link to="/">Principal</Link></li>
          <li><Link to="/productos">🎮Juegos</Link></li>
          <li><Link to="/productos">🕹️Consolas</Link></li>
          <li><Link to="/productos">🎭Merchandising</Link></li>
          <li><Link to="/ofertas">％Ofertas</Link></li>   {/* PENDIENTE DE HACER */}
          <li><Link to="/login">LOGIN</Link></li>
          <li><Link to="/register">REGISTRO</Link></li>
          <li><Link to="/register">CARRITO</Link></li>
          <li><Link to="/*">NotFound</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;