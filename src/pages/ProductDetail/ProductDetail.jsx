import { useParams } from "react-router-dom";
import { useVideojuegos, useConsolas, useMerchandising } from "../../api/useProduct";
import { Heart } from 'lucide-react';
import Header from "../../components/Header/Header";
import Loading from "../../components/Loading/Loading";
import "./ProductDetail.css";

function ProductDetail() {
  const { id, tipo } = useParams();
  
  const { videojuegos, loading: loadingVideojuegos } = useVideojuegos();
  const { consolas, loading: loadingConsolas } = useConsolas();
  const { merchandising, loading: loadingMerch } = useMerchandising();

  let data = [];
  let loading = false;
  
  if (tipo === "videojuegos") {
    data = videojuegos;
    loading = loadingVideojuegos;
  } else if (tipo === "consolas") {
    data = consolas;
    loading = loadingConsolas;
  } else if (tipo === "merchandising") {
    data = merchandising;
    loading = loadingMerch;
  }

  const producto = data.find(p => p.id === parseInt(id));

  if (loading) {
    return (
      <div>
        <Header />
        <Loading />
      </div>
    );
  }

  if (!producto) {
    return (
      <div>
        <Header />
        <div className="product-detail-container">
          <p style={{ color: 'white', textAlign: 'center' }}>Producto no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="product-detail-container">
        <div className="product-detail">
          <div className="product-image">
            <img src={producto.imagen_url} alt={producto.nombre} />
          </div>
          <div className="product-details">
            <h1>{producto.nombre}</h1>
            <p className="price">{producto.precio} €</p>
            
            <div className="button-group">
              <button className="wishlist-btn">
                <Heart size={24} />
              </button>
              <button className="add-to-cart">Añadir a la cesta</button>
            </div>
          </div>
        </div>
        
        <div className="product-description-section">
          <h2>Acerca de</h2>
          <p className="description">
            {producto.descripcion || "Descripción no disponible"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;