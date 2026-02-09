import { Search as SearchIcon, X } from 'lucide-react';
import { useState } from 'react';
import './Search.css';

function Search({ busqueda, setBusqueda, handleSearch }) {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log('isExpanded:', isExpanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded && busqueda) {
      setBusqueda("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      handleSearch(e);
      setIsExpanded(false);
    }
  };

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
          type={isExpanded && busqueda ? "submit" : "button"}
          onClick={isExpanded && busqueda ? undefined : handleToggle}
          className="search-button"
        >
          {isExpanded && busqueda ? <SearchIcon size={22} /> : isExpanded ? <X size={22} /> : <SearchIcon size={22} />}
        </button>
      </form>
    </div>
  );
}

export default Search;