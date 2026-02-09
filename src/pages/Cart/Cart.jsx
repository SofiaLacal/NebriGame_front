import { User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart, useDeleteCart } from '../../api/useCart';
import { useNavigate } from 'react-router-dom';
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
        // The backend includes producto data via Sequelize include
        const producto = item.producto || {};
        return {
          id: item.id,
          producto_id: item.producto_id,
          nombre: producto.nombre || 'Producto',
          precio: parseFloat(producto.precio || 0),
          imagen: producto.imagen_url ? getImageUrl(producto.imagen_url) : '',
          cantidad: item.cantidad
        };
      });
      setProductosCarrito(productos);
    } else {
      setProductosCarrito([]);
    }
  }, [cart]);

  // Calcular total
  const calcularTotal = () => {
    if (productosCarrito.length === 0) return '0.00';
    return productosCarrito.reduce((total, producto) => 
      total + (producto.precio * producto.cantidad), 0
    ).toFixed(2);
  };

  // Eliminar producto del carrito
  const eliminarProducto = async (productoId) => {
    if (userId) {
      try {
        await useDeleteCart(userId, productoId);
        // Update local state immediately for better UX
        setProductosCarrito(productosCarrito.filter(p => p.producto_id !== productoId));
      } catch (error) {
        console.error('Error eliminando producto del carrito:', error);
      }
    }
  };

  // Añadir a wishlist
  const agregarAWishlist = (producto) => {
    // Aquí iría tu lógica para añadir a wishlist
    console.log("Añadir a wishlist:", producto);
    // Ejemplo: llamar a tu API o hook de wishlist
  };

  // Continuar con la compra
  const continuarCompra = () => {
    navigate('/pago');
  };

  return (
    <div className='cart-page'>
      <SimpleHeader />
      
      <div className='cart-container'>
        <div className="cart-header">
          <div className="checkout-steps">
            <div className="step active">
              <div className="step-number">1</div>
              <span>Carro</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-number">2</div>
              <span>Pago</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-number">3</div>
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
                  <div key={producto.id} className="product-item">
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre}
                      className="product-image"
                    />
                    
                    <div className="product-info">
                      <h3 className="product-name">{producto.nombre}</h3>
                      
                      <div className="product-price-container">
                        <span className="product-price">
                          €{producto.precio.toFixed(2)}
                        </span>
                        
                        <div className="product-actions">
                          <button 
                            className="btn-icono btn-wishlist"
                            onClick={() => agregarAWishlist(producto)}
                            title="Añadir a wishlist"
                          >
                            ♡
                          </button>
                          <button 
                            className="btn-icono btn-eliminar"
                            onClick={() => eliminarProducto(producto.producto_id)}
                            title="Eliminar del carrito"
                          >
                            🗑️
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
              
              <div className="summary-content">
                <button 
                  className="btn-continue"
                  onClick={continuarCompra}
                >
                  Continuar con la compra
                </button>

                <div className="summary-detail">
                  <h3>Total productos</h3>
                  
                  <div className="summary-line">
                    <span>Subtotal ({productosCarrito.length} productos)</span>
                    <span>€{calcularTotal()}</span>
                  </div>
                  
                  <div className="summary-line">
                    <span>Gastos de envío</span>
                    <span>Gratis</span>
                  </div>

                  <div className="summary-total">
                    <div className="final-price">
                      <span>PRECIO FINAL</span>
                      <span>€{calcularTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="my-cart">
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Tu carrito está vacío</h3>
              <p>¡Añade productos para comenzar tu compra!</p>
              <button 
                className="btn-keep-shopping"
                onClick={() => navigate('/')}
              >
                Seguir comprando
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default Cart;


