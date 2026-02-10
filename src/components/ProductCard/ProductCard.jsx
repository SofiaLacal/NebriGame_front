import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ id, imagen, nombre, precio, tipo }) {
  return (
    <Link to={`/producto/${tipo}/${id}`} className={`product-card product-card--${tipo}`}>
      <img
        src={imagen || "/placeholder.png"}
        alt={nombre}
        className="product-img"
        onError={(e) => { e.target.src = "/placeholder.png"; }}
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