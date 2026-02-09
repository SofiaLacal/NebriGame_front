import BackButton from '../BackButton/BackButton';
import './SearchFilter.css';

function SearchFilter({ 
  resultadosCount, 
  ordenar, 
  setOrdenar
}) {
  return (
    <div className="search-filter-wrapper">
      <div className="search-info">
        <p className="resultados-texto">
          {resultadosCount} resultado{resultadosCount !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="filtros-container">
        <BackButton texto="Limpiar búsqueda" className="limpiar-btn" />
        <select 
          id="ordenar"
          value={ordenar} 
          onChange={(e) => setOrdenar(e.target.value)}
          className="filtro-select"
        >
          <option value="defecto" disabled hidden>
            Selecciona...
          </option>
          <option value="precio-asc">Precio: Menor a Mayor</option>
          <option value="precio-desc">Precio: Mayor a Menor</option>
          <option value="nombre-asc">Nombre: A-Z</option>
          <option value="nombre-desc">Nombre: Z-A</option>
        </select>
      </div>
    </div>
  );
}

export default SearchFilter;