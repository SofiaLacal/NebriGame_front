import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useVideojuegos, useConsolas, useMerchandising } from "../../api/useProduct";
import { Heart, ArrowLeft } from 'lucide-react';
import Header from "../../components/Header/Header";
import Loading from "../../components/Loading/Loading";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { toast } from "../../stores/toastStore";
import "./ProductDetail.css";
import Footer from "../../components/Footer/Footer";
import getImageUrl from "../../utils/getImage";
import useUserStore from "../../stores/userStore";
import { useIsInWishlist, useAddWishlist, useDeleteWishlist } from "../../api/useWishlist";
import { useAddCart } from "../../api/useCart";
import BackButton from "../../components/BackButton/BackButton";

function ProductDetail() {
  const { id, tipo } = useParams();
  const navigate = useNavigate();
  const userId = useUserStore.getState().id;
  const { isInWishlist, loading: loadingWishlist } = useIsInWishlist(userId, id);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localIsInWishlist, setLocalIsInWishlist] = useState(isInWishlist);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDeleteModal, setProductToDeleteModal] = useState(null);
 
  // Sincronizar el estado local con el hook cuando cambie
  useEffect(() => {
    setLocalIsInWishlist(isInWishlist);
  }, [isInWishlist]);

  const handleToggleWishlist = (productId, productName) => {
    if (isUpdating) return;

    if (localIsInWishlist) {
      setProductToDeleteModal({ id: productId, nombre: productName });
      setShowConfirmModal(true);
    } else {
      handleAddToWishlist(productId);
    }
  };

  const handleConfirmRemoveWishlist = async () => {
    if (!productToDeleteModal) return;
    setIsUpdating(true);
    try {
      await useDeleteWishlist(userId, productToDeleteModal.id);
      setLocalIsInWishlist(false);
      toast.success("Producto eliminado de la wishlist");
    } catch (error) {
      console.error("Error al actualizar wishlist:", error);
      toast.error("No se pudo eliminar de la wishlist");
    } finally {
      setIsUpdating(false);
      setProductToDeleteModal(null);
    }
  };

  const handleAddToWishlist = async (productId) => {
    setIsUpdating(true);
    try {
      await useAddWishlist(userId, productId);
      setLocalIsInWishlist(true);
      toast.success("Producto añadido a la wishlist");
    } catch (error) {
      console.error("Error al añadir a la wishlist:", error);
      toast.error("No se pudo añadir a la wishlist");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await useAddCart(userId, productId);
      toast.success("Producto añadido al carrito");
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      toast.error("No se pudo añadir al carrito");
    } finally {
      setIsUpdating(false);
    }
  };
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
    return <Navigate to="/*" replace />;
  }

  return (
    <div>
      <Header />
      <div className="contenedor-detalle">
        <BackButton>
          <ArrowLeft size={24} />
        </BackButton>
        <div className="contenedor-principal">
          <div className="detalle">
            <div className={`imagen-container imagen-container--${tipo}`}>
              <img src={getImageUrl(producto.imagen_url)} alt={producto.nombre} className="imagen" />
            </div>
            <div className="info">
              <h1>{producto.nombre}</h1>
              <p className="precio">{producto.precio} €</p>
              
              <div className="botones">
                <button 
                  className="boton-wishlist"
                  onClick={() => handleToggleWishlist(producto.id, producto.nombre)}
                  disabled={isUpdating || loadingWishlist}
                  title={localIsInWishlist ? "Quitar de la wishlist" : "Añadir a la wishlist"}
                >
                  <Heart 
                    size={24} 
                    fill={localIsInWishlist ? "#e74c3c" : "none"} 
                    color={localIsInWishlist ? "#e74c3c" : "white"} 
                  />
                </button>
                <button className="boton-carrito" onClick={() => handleAddToCart(producto.id)} disabled={isUpdating}>Añadir al carrito</button>
              </div>
            </div>
          </div>
          
          <div className="seccion-descripcion">
            <h2>Acerca de</h2>
            <p className="descripcion">
              {producto.descripcion || "Descripción no disponible"}
            </p>

            <div className="especificaciones">
              {tipo === "videojuegos" && producto.juego && (
                <>
                  <div className="dato">
                    <span className="etiqueta">Género:</span>
                    <span className="valor">{producto.juego.genero}</span>
                  </div>
                  <div className="dato">
                    <span className="etiqueta">Edad mínima:</span>
                    <span className="valor">{producto.juego.edad_minima}+</span>
                  </div>
                  {producto.juego.plataformas && producto.juego.plataformas.length > 0 && (
                    <div className="dato">
                      <span className="etiqueta">Plataformas disponibles:</span>
                      <div className="lista-plataformas">
                        {producto.juego.plataformas.map((plataforma) => (
                          <span key={plataforma.id} className="plataforma">
                            {plataforma.nombre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {tipo === "consolas" && producto.consola && (
                <>
                  <div className="dato">
                    <span className="etiqueta">Fabricante:</span>
                    <span className="valor">{producto.consola.fabricante}</span>
                  </div>
                  <div className="dato">
                    <span className="etiqueta">Capacidad:</span>
                    <span className="valor">{producto.consola.capacidad_almacenamiento}</span>
                  </div>
                  {producto.consola.plataforma && (
                    <div className="dato">
                      <span className="etiqueta">Plataforma:</span>
                      <span className="valor">{producto.consola.plataforma.nombre}</span>
                    </div>
                  )}
                  {producto.consola.color && (
                    <div className="dato">
                      <span className="etiqueta">Color:</span>
                      <span className="valor">{producto.consola.color}</span>
                    </div>
                  )}
                </>
              )}

              {tipo === "merchandising" && producto.merchandising && (
                <div className="dato">
                  <span className="etiqueta">Categoría:</span>
                  <span className="valor">{producto.merchandising.categoria}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <ConfirmModal
        open={showConfirmModal}
        onClose={() => { setShowConfirmModal(false); setProductToDeleteModal(null); }}
        onConfirm={handleConfirmRemoveWishlist}
        title="Eliminar de la wishlist"
        message={productToDeleteModal ? `¿Eliminar ${productToDeleteModal.nombre} de tu lista de deseos?` : ""}
      />
    </div>
  );
}

export default ProductDetail;