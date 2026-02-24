import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../api/useCart';
import { usePayment, useAddPaymentMethod, useDeletePaymentMethod } from '../../api/usePayment';
import { createOrder } from '../../api/useOrders';
import Footer from '../../components/Footer/Footer';
import useUserStore from '../../stores/userStore';
import { toast } from '../../stores/toastStore';
import './Payment.css';
import CartHeader from '../../components/CartHeader/CartHeader';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useUserStore.getState().id;

  const { direccion, total } = location.state || {};

  const { cart, loading: cartLoading } = useCart(userId);
  const [productosCarrito, setProductosCarrito] = useState([]);
  const { payment, loading: paymentLoading, refetchPayment } = usePayment(userId);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({ tipo: 'tarjeta', detalles: '' });
  const [processingOrder, setProcessingOrder] = useState(false);

  // Sincronizar productos del carrito
  useEffect(() => {
    if (cart && cart.length > 0) {
      const productos = cart.map((item) => {
        const producto = item.producto || {};

        return {
          id: item.id,
          productoId: item.producto_id || producto.id,
          plataforma_id: item.plataforma_id ?? 0,
          nombre: producto.nombre || 'Producto',
          precio: parseFloat(producto.precio || 0),
          cantidad: item.cantidad || 1,
        };
      });

      setProductosCarrito(productos);

    } else {
      setProductosCarrito([]);
    }
  }, [cart]);

  const calcularTotal = () => {
    if (total) return total;

    if (productosCarrito.length === 0) return '0.00';

    return productosCarrito
      .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
      .toFixed(2);
  };

  // Añadir método de pago
  const handleAddMethod = async (e) => {
    e.preventDefault();

    if (!newMethod.tipo || !newMethod.detalles.trim()) return;

    try {
      const data = await useAddPaymentMethod(userId, newMethod.tipo, newMethod.detalles.trim());
      setNewMethod({ tipo: 'tarjeta', detalles: '' });
      setIsAddingMethod(false);
      refetchPayment();
      if (data?.metodoPago) setSelectedPaymentMethod(data.metodoPago);
      toast.success('Método de pago añadido');

    } catch (error) {
      console.error('Error añadiendo método de pago:', error);
      toast.error('Error al añadir método de pago');
    }
  };

  // Eliminar método de pago
  const handleDeleteMethod = async (e, metodoId) => {
    e.stopPropagation();

    try {
      await useDeletePaymentMethod(userId, metodoId);
      if (selectedPaymentMethod?.id === metodoId) setSelectedPaymentMethod(null);
      refetchPayment();
      toast.success('Método de pago eliminado');

    } catch (error) {
      console.error('Error eliminando método de pago:', error);
      toast.error('Error al eliminar método de pago');
    }
  };

  // Confirmar pedido
  const confirmarPedido = async () => {

    if (productosCarrito.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error('Selecciona un método de pago');
      return;
    }

    setProcessingOrder(true);

    try {
      // Preparar datos del pedido
      const orderData = {
        direccion_id: direccion.id,
        telefono_contacto: direccion.telefono || direccion.telefonoContacto || '000000000',
        metodo_pago_id: selectedPaymentMethod.id,
        notas: 'Notas del pedido'
      };

      // Crear el pedido
      await createOrder(userId, orderData);

      toast.success('¡Pedido realizado con éxito!');
      
      // Navegar a la página de pedidos después de 1 segundo
      setTimeout(() => {
        navigate('/pedidos');
      }, 1000);

    } catch (error) {
      console.error('Error al crear pedido:', error);
      toast.error(error.message || 'Error al procesar el pedido. Inténtalo de nuevo.');

    } finally {
      setProcessingOrder(false);
    }
  };

  return (
    <>
      <div className="payment-page">
        <CartHeader pasoActual={3} />

        <div className="payment-container">
          <div className="payment-content">

            {/* Métodos de pago (izquierda) */}
            <div className="payment-form-panel">
              <h2>Método de pago</h2>

              {/* Lista de métodos guardados */}
              {paymentLoading ? (
                <p className="no-methods-msg">Cargando métodos de pago...</p>
              ) : payment.length === 0 && !isAddingMethod ? (
                <p className="no-methods-msg">No tienes métodos de pago guardados.</p>
              ) : (
                payment.map((method) => (
                  <div
                    className={`payment-method-item ${selectedPaymentMethod?.id === method.id ? 'selected' : ''}`}
                    key={method.id}
                  >
                    <div
                      className="payment-method-info"
                      onClick={() => setSelectedPaymentMethod(method)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setSelectedPaymentMethod(method);
                      }}
                    >
                      <h3>{method.tipo}</h3>
                      <p>{method.detalles}</p>
                    </div>
                    <button
                      type="button"
                      className="btn-delete-method"
                      onClick={(e) => handleDeleteMethod(e, method.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}

              {/* Formulario de nuevo método */}
              {isAddingMethod && (
                <div className="add-method-form">
                  <h3>Nuevo método de pago</h3>

                  <div className="form-group-payment">
                    <label htmlFor="tipo">Tipo</label>
                    <select
                      id="tipo"
                      value={newMethod.tipo}
                      onChange={(e) => setNewMethod((prev) => ({ ...prev, tipo: e.target.value }))}
                    >
                      <option value="tarjeta">Tarjeta de crédito / débito</option>
                      <option value="paypal">PayPal</option>
                      <option value="transferencia">Transferencia bancaria</option>
                    </select>
                  </div>

                  <div className="form-group-payment">
                    <label htmlFor="detalles">Detalles</label>
                    <input
                      type="text"
                      id="detalles"
                      value={newMethod.detalles}
                      onChange={(e) => setNewMethod((prev) => ({ ...prev, detalles: e.target.value }))}
                      placeholder="**** **** **** 1234"
                    />
                  </div>

                  <div className="add-method-actions">
                    <button type="button" className="btn-save-method" onClick={handleAddMethod}>
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="btn-cancel-method"
                      onClick={() => setIsAddingMethod(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Botón para mostrar el formulario */}
              {!isAddingMethod && (
                <button
                  type="button"
                  className="btn-add-method"
                  onClick={() => setIsAddingMethod(true)}
                >
                  + Añadir método de pago
                </button>
              )}
            </div>

            {/* Resumen (derecha) */}
            <div className="payment-summary">
              <h2>Resumen</h2>

              <div className="summary-content-payment">

                {/* Productos */}
                <div className="summary-detail-payment">
                  <h3>Total productos</h3>

                  {cartLoading ? (
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>Cargando...</p>
                  ) : (
                    <>
                      {productosCarrito.map((p) => (
                        <div className="summary-line-payment" key={p.id}>
                          <span>{p.nombre} x{p.cantidad}</span>
                          <span>{(p.precio * p.cantidad).toFixed(2)}€</span>
                        </div>
                      ))}

                      <div className="summary-line-payment">
                        <span>Gastos de envío</span>
                        <span>Gratis</span>
                      </div>

                      <div className="summary-total-payment">
                        <div className="final-price-payment">
                          <span>Precio final</span>
                          <span>{calcularTotal()}€</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Dirección de envío (si viene de Shipping) */}
                {direccion && (
                  <div className="summary-address-payment">
                    <h3>Dirección de envío</h3>
                    <p>
                      {direccion.calle}, {direccion.numeroCasa}<br />
                      {direccion.codigoPostal} {direccion.ciudad}<br />
                      {direccion.region === 'canarias' ? 'Islas Canarias' : 'Península y Baleares'}<br />
                      Tel: {direccion.telefono || direccion.telefonoContacto}
                    </p>
                  </div>
                )}

                {/* Botón confirmar pedido */}
                <button
                  type="button"
                  className="btn-pay"
                  onClick={confirmarPedido}
                  disabled={!selectedPaymentMethod || processingOrder || productosCarrito.length === 0}
                  title={
                    !selectedPaymentMethod
                      ? 'Selecciona un método de pago'
                      : productosCarrito.length === 0
                      ? 'Tu carrito está vacío'
                      : ''
                  }
                >
                  {processingOrder ? 'Procesando...' : 'Confirmar pedido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Payment;