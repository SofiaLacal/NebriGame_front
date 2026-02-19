import { useState } from "react";
import { useDeleteWishlist, useWishlist } from "../../api/useWishlist";
import useUserStore from "../../stores/userStore";
import getImageUrl from "../../utils/getImage";
import noDisponible from "../../assets/images/no-disponible.jpg";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { toast } from "../../stores/toastStore";
import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './Wishlist.css';
import BackButton from "../../components/BackButton/BackButton";

const Wishlist = () => {
  const userId = useUserStore.getState().id;
  const { wishlist, loading, refetchWishlist } = useWishlist(userId);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  useEffect(() => {
    if (!userId) {
      navigate('/login', { state: { from: '/wishlist' } });
    }
  }, [userId, navigate]);

  // Función para obtener el tipo correcto de producto
  const getTipoProducto = (producto) => {
    if (producto.tipo === "juego") return "videojuegos";
    if (producto.tipo === "consola") return "consolas";
    if (producto.tipo === "merchandising") return "merchandising";

    return producto.tipo;
  };

  const openConfirmModal = (product) => {
    setProductToDelete({ id: product.id, nombre: product.nombre });
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setProductToDelete(null);
  };

  const handleConfirmRemove = async () => {
    if (!productToDelete) return;

    try {
      await useDeleteWishlist(userId, productToDelete.id);
      refetchWishlist();
      toast.success("Producto eliminado de la wishlist");
      
    } catch (err) {
      console.error("No se pudo eliminar de la wishlist:", err);
      toast.error("No se pudo eliminar de la wishlist");
    }
  };

  const handleClick = (product) => {
    navigate(`/producto/${getTipoProducto(product)}/${product.id}`);
  };
  
  return (
    <>
      <div className="wishlist-background">
        <Header />

      <div className="wishlist-container">
        <BackButton>
          <ArrowLeft size={24} />
        </BackButton>
        {/* Título de la página */}
        <div className="wishlist-header">
          <h1>Lista de Deseos</h1>
          <br/>
          <p>
            {wishlist.length > 0 
              ? `Tienes ${wishlist.length} producto${wishlist.length !== 1 ? 's' : ''} guardado${wishlist.length !== 1 ? 's' : ''}`
              : 'Aún no has añadido productos a tu wishlist'
            }
          </p>
        </div>

          {/* Contenido principal */}
          <div>
            {loading ? (
              <div className="wishlist-loading">
                <p>Cargando tu wishlist...</p>
              </div>
            ) : wishlist.length > 0 ? (
              <ul className="wishlist-grid">
                {wishlist.map((product) => (
                  <li key={product.id} className="wishlist-card" onClick={() => handleClick(product)}>
                    {/* Imagen del producto */}
                    <div className="wishlist-image-container">
                      <img 
                        src={getImageUrl(product.imagen_url)} 
                        alt={product.nombre}
                        onClick={() => handleClick(product)}
                        onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noDisponible;
                      }}
                      />
                    </div>

                    {/* Información del producto */}
                    <div className="wishlist-info">
                      <h2 className="wishlist-product-name">{product.nombre}</h2>
                      <p className="wishlist-product-price">{product.precio}€</p>
                      <span className="wishlist-product-type">{getTipoProducto(product)}</span>

                      {/* Corazón rojo en la esquina inferior derecha - CLICKEABLE */}
                      <button 
                        className="wishlist-heart-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfirmModal(product);
                        }}
                        title="Quitar de la wishlist"
                        aria-label="Quitar de la wishlist"
                      >
                        <Heart fill="#e74c3c" color="#e74c3c" size={24} />
                      </button>
                    </div>
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
      </div>

      <Footer />

      <ConfirmModal
        open={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmRemove}
        title="Eliminar de la wishlist"
        message={productToDelete ? `¿Eliminar ${productToDelete.nombre} de tu lista de deseos?` : ""}
      />
    </>
  );
};

export default Wishlist;