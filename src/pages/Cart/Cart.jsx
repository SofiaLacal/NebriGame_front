import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete, AiOutlineShoppingCart } from 'react-icons/ai';
import { useCart, useDeleteCart, useChangeQuantity, validateCartStock } from '../../api/useCart';
import Footer from '../../components/Footer/Footer';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { toast } from '../../stores/toastStore';
import './Cart.css';
import useUserStore from '../../stores/userStore';
import getImageUrl from '../../utils/getImage';
import noDisponible from "../../assets/images/no-disponible.jpg";
import CartHeader from '../../components/CartHeader/CartHeader';

function Cart() {
  const navigate = useNavigate();
  const userId = useUserStore.getState().id;
  const { cart, loading: cartLoading } = useCart(userId);
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [editingQuantity, setEditingQuantity] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
      if (!userId) {
        navigate('/login', { state: { from: '/carrito' } });
      }

    if (cart && cart.length > 0) {
      const productos = cart.map((item) => {
        const producto = item.producto || {};
        const plataforma = item.plataforma;
        return {
          id: item.id,
          producto_id: item.producto_id,
          plataforma_id: item.plataforma_id ?? 0,
          plataformaNombre: plataforma?.nombre || null,
          nombre: producto.nombre || 'Producto',
          precio: parseFloat(producto.precio || 0),
          imagen: producto.imagen_url ? getImageUrl(producto.imagen_url) : '',
          cantidad: item.cantidad || 1
        };
      });

      setProductosCarrito(productos);

    } else {
      setProductosCarrito([]);
    }
  }, [cart, userId, navigate]);

  const calcularTotal = () => {

    if (productosCarrito.length === 0) return '0.00';

    return productosCarrito
      .reduce((total, producto) => total + producto.precio * producto.cantidad, 0)
      .toFixed(2);
  };

  const openConfirmModal = (producto) => {

    setProductToDelete({
      productoId: producto.producto_id,
      plataformaId: producto.plataforma_id ?? 0,
      nombre: producto.nombre
    });

    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setProductToDelete(null);
  };

  const eliminarProducto = async (productoId, plataformaId = 0) => {

    if (!userId) return;

    try {
      await useDeleteCart(userId, productoId, plataformaId);
      setProductosCarrito(prev => prev.filter(p => !(p.producto_id === productoId && (p.plataforma_id ?? 0) === plataformaId)));
      setEditingQuantity(prev => {
        const next = { ...prev };
        delete next[`${productoId}-${plataformaId}`];
        return next;
      });
      toast.success("Producto eliminado del carrito");
      
    } catch (error) {
      console.error('Error eliminando producto del carrito:', error);
      toast.error("No se pudo eliminar del carrito");
    }
  };

  const handleConfirmEliminar = async () => {
    if (!productToDelete) return;
    await eliminarProducto(productToDelete.productoId, productToDelete.plataformaId);
  };

  const setCantidad = async (productoId, newCantidad, plataformaId = 0) => {
    if (!userId || newCantidad < 1) return;

    try {
      await useChangeQuantity(userId, productoId, newCantidad, plataformaId);
      setProductosCarrito(prev =>
        prev.map(p =>
          p.producto_id === productoId && (p.plataforma_id ?? 0) === plataformaId ? { ...p, cantidad: newCantidad } : p
        )
      );

      setEditingQuantity(prev => ({ ...prev, [`${productoId}-${plataformaId}`]: undefined }));

    } catch (err) {
      console.error('Error actualizando cantidad:', err);
      toast.error(err.message || 'No se pudo actualizar la cantidad');
    }
  };

  const getItemKey = (p) => `${p.producto_id}-${p.plataforma_id ?? 0}`;

  // Sumar producto
  const sumarProducto = async (producto) => {
    const newCantidad = producto.cantidad + 1;
    await setCantidad(producto.producto_id, newCantidad, producto.plataforma_id ?? 0);
  };

  // Restar producto (si llega a 0, mostrar modal de confirmación)
  const restarProducto = (producto) => {
    const newCantidad = producto.cantidad - 1;

    if (newCantidad < 1) {
      openConfirmModal(producto);
      return;
    }

    setCantidad(producto.producto_id, newCantidad, producto.plataforma_id ?? 0);
  };

  const commitQuantityInput = (producto) => {
    const raw = editingQuantity[getItemKey(producto)];

    if (raw === undefined || raw === '') {
      setEditingQuantity(prev => {
        const next = { ...prev };
        delete next[getItemKey(producto)];
        return next;
      });

      return;
    }

    const num = parseInt(raw, 10);
    const newCantidad = Number.isNaN(num) ? producto.cantidad : Math.max(1, num);

    if (newCantidad < 1) {
      openConfirmModal(producto);

    } else {
      setCantidad(producto.producto_id, newCantidad, producto.plataforma_id ?? 0);
    }
  };

  const continuarCompra = async () => {
    if (!userId) return;

    try {
      const { valido, errores } = await validateCartStock(userId);

      if (!valido && errores?.length > 0) {
        const primerError = errores[0];
        toast.error(`Stock insuficiente para ${primerError.nombre}. Disponible: ${primerError.stockDisponible}`);
        return;
      }

      navigate('/envio');
      
    } catch (error) {
      console.error('Error validando stock:', error);
      toast.error(error.message || 'Error al validar el carrito');
    }
  };

  return (
    <>
      <div className='cart-page'>
        <CartHeader pasoActual={1} />

        <div className='cart-container'>

          {cartLoading ? (
            <div className="my-cart">
              <div className="empty-cart">
                <div className="empty-cart-icon">⏳</div>
                <h3>Cargando carrito...</h3>
              </div>
            </div>
          ) : productosCarrito.length > 0 ? (
            <div className="cart-content">
              <div className="my-cart">
                <h2>Carrito</h2>

                <div className="cart-products">
                  {productosCarrito.map((producto) => (
                    <div key={producto.id} className="product-item-cart">
                      <img 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        className="product-image-cart"
                        onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noDisponible;
                      }}
                      />

                      <div className="product-info-cart">
                        <h3 className="product-name-cart">
                          {producto.nombre}
                          {producto.plataformaNombre && (
                            <span className="producto-plataforma-cart"> ({producto.plataformaNombre})</span>
                          )}
                        </h3>

                        <div className="product-price-container-cart">
                          <span className="product-price-cart">
                            {producto.precio.toFixed(2)}€
                          </span>
                          <div className="product-actions-cart">
                            <button 
                              className="btn-icon-cart btn-minus-cart"
                              onClick={() => restarProducto(producto)}
                              title="Restar producto"
                              type="button"
                            >
                              <AiOutlineMinus />
                            </button>
                            <input
                              type="number"
                              min={1}
                              className="product-quantity-cart product-quantity-input-cart"
                              value={editingQuantity[getItemKey(producto)] ?? producto.cantidad}
                              onChange={(e) => setEditingQuantity(prev => ({ ...prev, [getItemKey(producto)]: e.target.value }))}
                              onBlur={() => commitQuantityInput(producto)}
                              onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                              aria-label={`Cantidad de ${producto.nombre}`}
                            />
                            <button 
                              className="btn-icon-cart btn-add-cart"
                              onClick={() => sumarProducto(producto)}
                              title="Añadir producto"
                              type="button"
                            >
                              <AiOutlinePlus />
                            </button>
                            <button 
                              className="btn-icon-cart btn-delete-cart"
                              onClick={() => openConfirmModal(producto)}
                              type="button"
                              title="Eliminar del carrito"
                            >
                              <AiOutlineDelete />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-summary">
                <h2>Resumen</h2>

                <div className="summary-content-cart">
                  <div className="summary-detail-cart">
                    <h3>Total productos</h3>

                    <div className="summary-line-cart">
                      <span>Subtotal</span>
                      <span>{calcularTotal()}€</span>
                    </div>

                    <div className="summary-line-cart">
                      <span>Gastos de envío</span>
                      <span>Gratis</span>
                    </div>

                    <div className="summary-total-cart">
                      <div className="final-price-cart">
                        <span>Precio final</span>
                        <span>{calcularTotal()}€</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn-continue-cart"
                    onClick={continuarCompra}
                  >
                    Continuar con la compra
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-cart">
              <div className="empty-cart">
                <div className="empty-cart-icon">
                  <AiOutlineShoppingCart />
                </div>
                <h3>Tu carrito está vacío</h3>
                <button 
                  className="btn-keep-shopping-cart"
                  onClick={() => navigate('/')}
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <ConfirmModal
        open={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmEliminar}
        title="Eliminar del carrito"
        message={productToDelete ? `¿Eliminar ${productToDelete.nombre} del carrito?` : ""}
      />
    </>
  );
}

export default Cart;
