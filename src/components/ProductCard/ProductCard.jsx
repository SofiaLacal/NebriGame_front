function ProductCard({ imagen, nombre, precio }) {
  return (
    <div className="product-card">
      <img src={imagen} alt={nombre} className="product-img" />

      <div className="product-info">
        <h3 className="product-name">{nombre}</h3>
        <p className="product-price">{precio} €</p>
      </div>
    </div>
  );
}

export default ProductCard;