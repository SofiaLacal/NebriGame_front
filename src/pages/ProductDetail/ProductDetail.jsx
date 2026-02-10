import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useVideojuegos, useConsolas, useMerchandising } from "../../api/useProduct";
import { Heart, ArrowLeft } from 'lucide-react';
import Header from "../../components/Header/Header";
import Loading from "../../components/Loading/Loading";
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
 
  // Sincronizar el estado local con el hook cuando cambie
  useEffect(() => {
    setLocalIsInWishlist(isInWishlist);
  }, [isInWishlist]);

  const handleToggleWishlist = async (productId) => {
    if (isUpdating) return; // Evitar múltiples clicks

    setIsUpdating(true);
    // Actualizar el estado local inmediatamente para feedback visual
    const newState = !localIsInWishlist;
    setLocalIsInWishlist(newState);

    try {
      if (localIsInWishlist) {
        await useDeleteWishlist(userId, productId);
        console.log("producto eliminado");
      } else {
        await useAddWishlist(userId, productId);
        console.log("producto añadido");
      }
      // Si todo va bien, liberamos el estado de actualización
      setIsUpdating(false);
    } catch (error) {
      console.error("Error al actualizar wishlist:", error);
      // Revertir el estado local si hay error
      setLocalIsInWishlist(!newState);
      setIsUpdating(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (isUpdating) return; // Evitar múltiples clicks
    setIsUpdating(true);
    try {
      await useAddCart(userId, productId);
      console.log("producto añadido");
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
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
                  onClick={() => handleToggleWishlist(producto.id)}
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
    </div>
  );
}

export default ProductDetail;