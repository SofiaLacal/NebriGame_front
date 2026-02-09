import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete, AiOutlineShoppingCart } from 'react-icons/ai';
import { useCart, useDeleteCart } from '../../api/useCart';
import Footer from '../../components/Footer/Footer';
import SimpleHeader from '../../components/SimpleHeader/SimpleHeader';
import './Cart.css';
import useUserStore from '../../stores/userStore';
import getImageUrl from '../../utils/getImage';

function Cart() {
  const navigate = useNavigate();
  const userId = useUserStore.getState().id;
  const { cart, loading: cartLoading } = useCart(userId);
  const [productosCarrito, setProductosCarrito] = useState([]);

  useEffect(() => {
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
  }, [cart]);

  const calcularTotal = () => {
    if (productosCarrito.length === 0) return '0.00';
    return productosCarrito
      .reduce((total, producto) => total + producto.precio * producto.cantidad, 0)
      .toFixed(2);
  };

  // Eliminar producto
  const eliminarProducto = async (productoId) => {
    if (userId) {
      try {
        await useDeleteCart(userId, productoId);
        setProductosCarrito(productosCarrito.filter(p => p.producto_id !== productoId));
      } catch (error) {
        console.error('Error eliminando producto del carrito:', error);
      }
    }
  };

  // Sumar producto
  const sumarProducto = (producto) => {
    setProductosCarrito(prevCarrito =>
      prevCarrito.map(p =>
        p.producto_id === producto.producto_id
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      )
    );
  };

  // Restar producto
  const restarProducto = (producto) => {
    setProductosCarrito(prevCarrito =>
      prevCarrito
        .map(p =>
          p.producto_id === producto.producto_id
            ? { ...p, cantidad: p.cantidad - 1 }
            : p
        )
        .filter(p => p.cantidad > 0)
    );
  };

  const continuarCompra = () => {
    navigate('/pago');
  };

  return (
    <>
      <div className='cart-page'>
        <SimpleHeader />

        <div className='cart-container'>
          <div className="cart-header">
            <div className="checkout-steps-cart">
              <div className="step-cart active">
                <div className="step-number-cart">1</div>
                <span>Carro</span>
              </div>
              <div className="step-line-cart"></div>
              <div className="step-cart">
                <div className="step-number-cart">2</div>
                <span>Pago</span>
              </div>
              <div className="step-line-cart"></div>
              <div className="step-cart">
                <div className="step-number-cart">3</div>
                <span>Envío</span>
              </div>
            </div>
          </div>

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
                            >
                              <AiOutlineMinus />
                            </button>
                            <span className="product-quantity-cart">
                              {producto.cantidad}
                            </span>
                            <button 
                              className="btn-icon-cart btn-add-cart"
                              onClick={() => sumarProducto(producto)}
                              title="Añadir producto"
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
                    Proceder al pago
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
