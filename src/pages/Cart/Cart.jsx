import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete, AiOutlineShoppingCart } from 'react-icons/ai';
import { useCart, useDeleteCart, useChangeQuantity } from '../../api/useCart';
import Footer from '../../components/Footer/Footer';
import './Cart.css';
import useUserStore from '../../stores/userStore';
import getImageUrl from '../../utils/getImage';
import CartHeader from '../../components/CartHeader/CartHeader';

function Cart() {
  const navigate = useNavigate();
  const userId = useUserStore.getState().id;
  const { cart, loading: cartLoading } = useCart(userId);
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [editingQuantity, setEditingQuantity] = useState({});

  useEffect(() => {
      if (!userId) {
        navigate('/login', { state: { from: '/carrito' } });
      }

    if (cart && cart.length > 0) {
      const productos = cart.map((item) => {
        const producto = item.producto || {};
        return {
          id: item.id,
          producto_id: item.producto_id,
          nombre: producto.nombre || 'Producto',
          precio: parseFloat(producto.precio || 0),
          imagen: producto.imagen_url ? getImageUrl(producto.imagen_url) : '',
          cantidad: item.cantidad || 1 // Asegurar cantidad inicial
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

  // Eliminar producto
  const eliminarProducto = async (productoId) => {
    if (!userId) return;
    try {
      await useDeleteCart(userId, productoId);
      setProductosCarrito(prev => prev.filter(p => p.producto_id !== productoId));
      setEditingQuantity(prev => {
        const next = { ...prev };
        delete next[productoId];
        return next;
      });
    } catch (error) {
      console.error('Error eliminando producto del carrito:', error);
    }
  };

  const setCantidad = async (productoId, newCantidad) => {
    if (!userId || newCantidad < 1) return;
    try {
      await useChangeQuantity(userId, productoId, newCantidad);
      setProductosCarrito(prev =>
        prev.map(p =>
          p.producto_id === productoId ? { ...p, cantidad: newCantidad } : p
        )
      );
      setEditingQuantity(prev => ({ ...prev, [productoId]: undefined }));
    } catch (err) {
      console.error('Error actualizando cantidad:', err);
    }
  };

  // Sumar producto
  const sumarProducto = async (producto) => {
    const newCantidad = producto.cantidad + 1;
    await setCantidad(producto.producto_id, newCantidad);
  };

  // Restar producto (si llega a 0, eliminar del carrito)
  const restarProducto = async (producto) => {
    const newCantidad = producto.cantidad - 1;
    if (newCantidad < 1) {
      await eliminarProducto(producto.producto_id);
      return;
    }
    await setCantidad(producto.producto_id, newCantidad);
  };

  const commitQuantityInput = (producto) => {
    const raw = editingQuantity[producto.producto_id];
    if (raw === undefined || raw === '') {
      setEditingQuantity(prev => {
        const next = { ...prev };
        delete next[producto.producto_id];
        return next;
      });
      return;
    }
    const num = parseInt(raw, 10);
    const newCantidad = Number.isNaN(num) ? producto.cantidad : Math.max(1, num);
    if (newCantidad < 1) {
      eliminarProducto(producto.producto_id);
    } else {
      setCantidad(producto.producto_id, newCantidad);
    }
  };

  const continuarCompra = () => {
    navigate('/envio');
  };

  return (
    <>
      <div className='cart-page'>
        <CartHeader />

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
                      />

                      <div className="product-info-cart">
                        <h3 className="product-name-cart">{producto.nombre}</h3>

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
                              value={editingQuantity[producto.producto_id] ?? producto.cantidad}
                              onChange={(e) => setEditingQuantity(prev => ({ ...prev, [producto.producto_id]: e.target.value }))}
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
                              onClick={() => eliminarProducto(producto.producto_id)}
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
    </>
  );
}

export default Cart;
