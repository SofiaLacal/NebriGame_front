import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, Tv, Gift, Percent, Heart, ShoppingCart, Menu, X, Search as SearchIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import UsuarioDropdown from '../UsuarioDropdown/UsuarioDropdown';
import './Header.css';
import logo from "../../../public/logo.png"

function Header({ busqueda = "", setBusqueda = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(busqueda);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const searchFormRef = useRef(null);

  useEffect(() => {
    setSearchTerm(busqueda);
  }, [busqueda]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);

    if (!isSearchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

    } else if (searchTerm) {
      setSearchTerm("");

      if (setBusqueda) setBusqueda("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (setBusqueda) setBusqueda(searchTerm);

    if (searchTerm.trim()) {
      const from = location.state?.from ?? location.pathname;
      navigate(`/productos?query=${encodeURIComponent(searchTerm)}`, {
        state: { from },
      });
      setIsMenuOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {

      if (searchFormRef.current && !searchFormRef.current.contains(e.target)) {
        setIsSearchExpanded(false);
      }
    };
    
    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    
  }, [isSearchExpanded]);

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo NebriGame" />
        </Link>

        <button type="button" className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
              onClick={toggleMenu}
            >
              Principal
            </Link>
          </li>
          <li>
            <Link
              to="/productos/videojuegos"
              className={location.pathname.startsWith('/productos/videojuegos') ? 'active' : ''}
              onClick={toggleMenu}
            >
              <Gamepad2 size={18} /> Juegos
            </Link>
          </li>
          <li>
            <Link
              to="/productos/consolas"
              className={location.pathname.startsWith('/productos/consolas') ? 'active' : ''}
              onClick={toggleMenu}
            >
              <Tv size={18} /> Consolas
            </Link>
          </li>
          <li>
            <Link
              to="/productos/merchandising"
              className={location.pathname.startsWith('/productos/merchandising') ? 'active' : ''}
              onClick={toggleMenu}
            >
              <Gift size={18} /> Merchandising
            </Link>
          </li>
          <li>
            <Link
              to="/ofertas"
              className={location.pathname === '/ofertas' ? 'active' : ''}
              onClick={toggleMenu}
            >
              <Percent size={18} /> Ofertas
            </Link>
          </li>

          {/* Buscador */}
          <li className="search-item">
            <form ref={searchFormRef} onSubmit={handleSearch} className={`header-search ${isSearchExpanded ? 'expanded' : ''}`}>
              <button
                type={isSearchExpanded && searchTerm ? "submit" : "button"}
                onClick={isSearchExpanded && searchTerm ? undefined : toggleSearch}
                className="header-search-btn"
              >
                <SearchIcon size={20} />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="header-search-input"
              />
            </form>
          </li>
        </ul>

        <ul className={`nav-links-right ${isMenuOpen ? 'active' : ''}`}>
          <UsuarioDropdown />
          <li>
            <Link
              to="/wishlist"
              className={location.pathname === '/wishlist' ? 'active' : ''}
              onClick={toggleMenu}
            >
              <Heart size={24} />
            </Link>
          </li>
          <li>
            <Link
              to="/carrito"
              className={location.pathname === '/carrito' ? 'active' : ''}
              onClick={toggleMenu}
            >
              <ShoppingCart size={24} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;