import { User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import SimpleHeader from '../../components/SimpleHeader/SimpleHeader';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  
  // Estado de ejemplo - reemplaza con tu lógica real del carrito
  const [productosCarrito, setProductosCarrito] = useState([
    {
      id: 1,
      nombre: "Producto 1",
      precio: 59.99,
      imagen: "/ruta/imagen1.jpg",
      cantidad: 1,
      tipo: 'videojuegos'
    },
    {
      id: 2,
      nombre: "Producto 2",
      precio: 49.99,
      imagen: "/ruta/imagen2.jpg",
      cantidad: 1,
      tipo: 'consolas'
    },
    {
      id: 3,
      nombre: "Producto 3",
      precio: 39.99,
      imagen: "/ruta/imagen3.jpg",
      cantidad: 1,
      tipo: 'merchandising'
    }
  ]);

  // Calcular total
  const calcularTotal = () => {
    return productosCarrito.reduce((total, producto) => 
      total + (producto.precio * producto.cantidad), 0
    ).toFixed(2);
  };

  // Eliminar producto del carrito
  const eliminarProducto = (id) => {
    setProductosCarrito(productosCarrito.filter(p => p.id !== id));
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

        {productosCarrito.length > 0 ? (
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
                            onClick={() => eliminarProducto(producto.id)}
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


