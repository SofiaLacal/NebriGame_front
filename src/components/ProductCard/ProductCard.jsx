import { Link } from "react-router-dom";
import { useState } from "react";
import noDisponible from "../../assets/images/no-disponible.jpg";
import "./ProductCard.css";

function ProductCard({ id, imagen, nombre, precio, tipo }) {
  const [isFallback, setIsFallback] = useState(false);

  return (
    <Link to={`/producto/${tipo}/${id}`} className={`product-card product-card--${tipo}`}>
      <img
        src={imagen || noDisponible}
        alt={nombre}
        className={`product-img ${isFallback ? 'product-img--fallback' : ''}`}
        onError={(e) => { 
          e.target.onerror = null;
          e.target.src = noDisponible;
          setIsFallback(true);
        }}
      />
      <div className="product-info">
        <h3 className="product-name">{nombre}</h3>
        <p className="product-price">
          {Number(precio).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;