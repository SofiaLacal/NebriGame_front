import './SearchFilter.css';

function SearchFilter({ resultadosCount, busqueda, ordenar, setOrdenar, onLimpiar }) {
  return (
    <div className="search-filter-wrapper">
      <p className="resultados-texto">
        {resultadosCount} resultado{resultadosCount !== 1 ? 's' : ''} para "{ busqueda }"
      </p>

      <div className="filtros-container">
        <button type="button" className="limpiar-btn" onClick={onLimpiar}>
          Limpiar búsqueda
        </button>
        <select
          id="ordenar"
          aria-label="Ordenar resultados"
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