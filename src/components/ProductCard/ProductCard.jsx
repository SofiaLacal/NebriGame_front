import { useNavigate } from "react-router-dom"
import "./ProductCard.css"

function ProductCard({ id, imagen, nombre, precio, tipo }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/producto/${tipo}/${id}`);
  };

  return (
    <div className={`product-card product-card--${tipo}`} onClick={handleClick}>
      <img src={imagen} alt={nombre} className="product-img" />
      <div className="product-info">
        <h3 className="product-name">{nombre}</h3>
        <p className="product-price">{precio} €</p>
      </div>
    </div>
  );
}

export default ProductCard;