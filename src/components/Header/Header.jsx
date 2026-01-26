import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <h2>Mi App</h2>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/*">NotFound</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;