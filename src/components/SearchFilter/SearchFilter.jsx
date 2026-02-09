import './SearchFilter.css';

function SearchFilter({ 
  resultadosCount, 
  ordenar, 
  setOrdenar, 
  onLimpiarFiltros 
}) {
  return (
    <div className="search-filter-wrapper">
      <div className="search-info">
        <p className="resultados-texto">
          {resultadosCount} resultado{resultadosCount !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="filtros-container">
        <button className="limpiar-btn" onClick={onLimpiarFiltros}>
          Limpiar búsqueda
        </button>
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