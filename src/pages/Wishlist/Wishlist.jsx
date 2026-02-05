import { useWishlist } from "../../api/useWishlist";
import useUserStore from "../../stores/userStore";
import getImageUrl from "../../utils/getImage";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Heart } from "lucide-react";
import './Wishlist.css';

const Wishlist = () => {
  const userId = useUserStore.getState().id;
  const { wishlist, loading } = useWishlist(userId);

  // Función para eliminar producto de la wishlist
  const handleRemoveFromWishlist = async (productId, productType) => {
    try {
      const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
      const response = await fetch(`${apiUrl}/wishlist/${userId}/${productType}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Recargar la página para actualizar la lista
        window.location.reload();
      } else {
        console.error('Error al eliminar el producto de la wishlist');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />

      <div className="wishlist-container">
        {/* Título de la página */}
        <div className="wishlist-header">
          <h1>Mi Lista de Deseos</h1>
          <p>
            {wishlist.length > 0 
              ? `Tienes ${wishlist.length} producto${wishlist.length !== 1 ? 's' : ''} guardado${wishlist.length !== 1 ? 's' : ''}`
              : 'Aún no has añadido productos a tu wishlist'
            }
          </p>
        </div>

        {/* Contenido principal */}
        <div className="wishlist-content">
          {loading ? (
            <div className="wishlist-loading">
              <p>Cargando tu wishlist...</p>
            </div>
          ) : wishlist.length > 0 ? (
            <ul className="wishlist-grid">
              {wishlist.map((product) => (
                <li key={product.id} className="wishlist-card">
                  {/* Imagen del producto */}
                  <div className="wishlist-image-container">
                    <img 
                      src={getImageUrl(product.imagen_url)} 
                      alt={product.nombre}
                    />
                  </div>

                  {/* Información del producto */}
                  <div className="wishlist-info">
                    <h3 className="wishlist-product-name">{product.nombre}</h3>
                    <p className="wishlist-product-price">{product.precio}€</p>
                    <span className="wishlist-product-type">{product.tipo}</span>
                  </div>

                  {/* Corazón rojo en la esquina inferior derecha - CLICKEABLE */}
                  <button 
                    className="wishlist-heart-icon"
                    onClick={() => handleRemoveFromWishlist(product.id, product.tipo)}
                    title="Quitar de la wishlist"
                    aria-label="Quitar de la wishlist"
                  >
                    <Heart fill="#e74c3c" color="#e74c3c" size={24} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">
                <Heart size={64} color="#ccc" />
              </div>
              <h3>Tu wishlist está vacía</h3>
              <p>Explora nuestros productos y añade tus favoritos</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Wishlist;