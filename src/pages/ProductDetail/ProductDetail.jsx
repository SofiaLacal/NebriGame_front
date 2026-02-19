import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useVideojuegos, useConsolas, useMerchandising, useProductStock } from "../../api/useProduct";
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
import PlataformaDropdown from "../../components/PlataformaDropdown/PlataformaDropdown";
import noDisponible from "../../assets/images/no-disponible.jpg";

function ProductDetail() {
  const { id, tipo } = useParams();
  const navigate = useNavigate();
  const userId = useUserStore.getState().id;
  const { isInWishlist, loading: loadingWishlist } = useIsInWishlist(userId, id);
  const productoId = id ? parseInt(id, 10) : null;
  const { stock, plataformas, loading: loadingStock } = useProductStock(productoId);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localIsInWishlist, setLocalIsInWishlist] = useState(isInWishlist);
  const [plataformaSeleccionada, setPlataformaSeleccionada] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDeleteModal, setProductToDeleteModal] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

    useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, tipo]);

  useEffect(() => {
    setLocalIsInWishlist(isInWishlist);
  }, [isInWishlist]);

  useEffect(() => {
    if (tipo === "videojuegos" && Array.isArray(plataformas) && plataformas.length > 0) {
      setPlataformaSeleccionada(prev => {
        const prevStr = prev != null ? String(prev) : "";
        const exists = prevStr && plataformas.some(p => String(p.id) === prevStr);
        return exists ? prevStr : String(plataformas[0].id);
      });
    } else {
      setPlataformaSeleccionada(null);
    }
  }, [tipo, plataformas]);

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

  const handleAddToCart = async (productId, plataformaId = null) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await useAddCart(userId, productId, 1, plataformaId);
      toast.success("Producto añadido al carrito");
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      toast.error(error.message || "No se pudo añadir al carrito");
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

  let stockDisponible;
  if (tipo === "videojuegos") {
    if (Array.isArray(plataformas) && plataformas.length > 0 && plataformaSeleccionada != null && plataformaSeleccionada !== "") {
      const plataforma = plataformas.find(p => String(p.id) === String(plataformaSeleccionada));
      stockDisponible = plataforma != null ? (Number(plataforma.control_stock) || 0) : 0;
    } else {
      stockDisponible = 0;
    }
  } else {
    stockDisponible = stock;
  }

  const handleAvisoReposicion = () => {
    toast.success("Te avisaremos cuando repongamos, muchas gracias");
  };

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
              <img
              src={getImageUrl(producto.imagen_url)}
              alt={producto.nombre}
              className={`imagen ${isFallback ? 'imagen--fallback' : ''}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = noDisponible;
                setIsFallback(true);
              }}
            />
            </div>

            <div className="info">
              <h1>{producto.nombre}</h1>

              <div className="precio-row">
                <p className="precio">{producto.precio} €</p>

                {tipo === "videojuegos" && plataformas && plataformas.length > 0 && (
                  <PlataformaDropdown
                    plataformas={plataformas}
                    plataformaSeleccionada={plataformaSeleccionada}
                    onSeleccionar={setPlataformaSeleccionada}
                  />
                )}
              </div>

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

                {loadingStock ? (
                  <button className="boton-carrito" disabled>
                    Cargando...
                  </button>
                ) : stockDisponible > 0 ? (
                  <button
                    className="boton-carrito"
                    onClick={() => handleAddToCart(producto.id, tipo === "videojuegos" ? plataformaSeleccionada : null)}
                    disabled={isUpdating}
                  >
                    Añadir al carrito
                  </button>
                ) : (
                  <button
                    className="boton-aviso-reposicion"
                    onClick={handleAvisoReposicion}
                  >
                    Recibir un email cuando se reponga stock
                  </button>
                )}
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
        onClose={() => {
          setShowConfirmModal(false);
          setProductToDeleteModal(null);
        }}
        onConfirm={handleConfirmRemoveWishlist}
        title="Eliminar de la wishlist"
        message={
          productToDeleteModal
            ? `¿Eliminar ${productToDeleteModal.nombre} de tu lista de deseos?`
            : ""
        }
      />
    </div>
  );
}

export default ProductDetail;