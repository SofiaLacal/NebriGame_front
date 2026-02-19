import { Search as SearchIcon, X } from 'lucide-react';
import { useState } from 'react';
import './Search.css';

function Search({ busqueda, setBusqueda, handleSearch }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);

    if (isExpanded && busqueda) {
      setBusqueda("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (busqueda.trim()) {
      handleSearch(busqueda.trim());
      setIsExpanded(false);
    }
  };

  const esSubmit = isExpanded && busqueda;
  const icono = isExpanded && !busqueda ? <X size={22} /> : <SearchIcon size={22} />;
  const ariaLabel = esSubmit ? "Buscar" : isExpanded ? "Cerrar búsqueda" : "Abrir búsqueda";

  return (
    <div className="search-expandable">
      <form onSubmit={handleSubmit} className={`search-form ${isExpanded ? 'expanded' : ''}`}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <button
          type={esSubmit ? "submit" : "button"}
          onClick={!esSubmit ? handleToggle : undefined}
          className="search-button"
          aria-label={ariaLabel}
        >
          {icono}
        </button>
      </form>
    </div>
  );
}

export default Search;