import { useState, useEffect } from 'react';
import './PlataformaDropdown.css';

function PlataformaDropdown({ plataformas, plataformaSeleccionada, onSeleccionar }) {
  const [isOpen, setIsOpen] = useState(false);

  const plataformaActual = plataformas.find(
    p => String(p.id) === String(plataformaSeleccionada)
  );

  useEffect(() => {
    const handleClickOutside = (e) => {

      if (!e.target.closest('.plataforma-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="plataforma-container">
      <span
        className={`plataforma-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
      >
        {plataformaActual?.nombre ?? 'Selecciona plataforma'}
      </span>

      {isOpen && (
        <div className="plataforma-dropdown">
          {plataformas.map((p) => (
            <button
              key={p.id}
              className={String(p.id) === String(plataformaSeleccionada) ? 'selected' : ''}
              onClick={() => {
                onSeleccionar(String(p.id));
                setIsOpen(false);
              }}
            >
              {p.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlataformaDropdown;