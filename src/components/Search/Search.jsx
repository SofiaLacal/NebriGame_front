import { Search as SearchIcon } from 'lucide-react';
import './Search.css';

function Search({ 
  busqueda, 
  setBusqueda, 
  handleSearch, 
  buscando, 
  resultadosCount,
  ordenar,
  setOrdenar,
  onLimpiarFiltros,
  hayFiltros 
}) {
  return (
    <div className="buscador-container">
      <form onSubmit={handleSearch} className="buscador-form">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscador-input"
        />
        <button type="submit" className="buscador-boton">
          <SearchIcon size={24} />
        </button>
      </form>

      <div className="resultados-y-filtros">
        <div className="search-info">
          {buscando && (
            <p>{resultadosCount} resultado{resultadosCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        
        <div className="filtros-container">
          {hayFiltros && (
            <button className="limpiar-btn" onClick={onLimpiarFiltros}>
              Limpiar filtro
            </button>
          )}
          
          <select 
            id="ordenar"
            value={ordenar} 
            onChange={(e) => setOrdenar(e.target.value)}
            className="filtro-select"
          >
            <option value="defecto" disabled hidden>
              Ordenar por:
            </option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="nombre-asc">Nombre: A-Z</option>
            <option value="nombre-desc">Nombre: Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Search;