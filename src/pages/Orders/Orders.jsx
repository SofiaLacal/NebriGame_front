import useUserStore from '../../stores/userStore';
import { useOrders } from '../../api/useOrders';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Loading from '../../components/Loading/Loading';
import './Orders.css';

function Orders() {
  const { id } = useUserStore();
  const { orders, loading } = useOrders(id);

  return (
    <>
      <div className="background-orders">
        <Header />

        <div className="pedidos-page-wrapper">
          <div className="pedidos-page-container">
            <h2 className="pedidos-titulo">Mis pedidos</h2>
            
            {loading ? (
              <Loading />
            ) : orders.length === 0 ? (
              <p className="pedidos-vacio">No tienes pedidos todavía</p>
            ) : (
              <div className="pedidos-lista">
                {orders.map((pedido, index) => (
                <div key={pedido.id} className="pedido-card">
                  <div className="pedido-header">
                    <span className="pedido-id">Pedido #{orders.length - index}</span>
                    <span className="pedido-fecha">
                      {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <span className={`pedido-estado pedido-estado--${pedido.estado}`}>
                      {pedido.estado}
                    </span>
                  </div>
                  
                  <div className="pedido-productos">
                    {pedido.productos?.map((producto, i) => (
                      <div key={i} className="pedido-producto">
                        <div className="pedido-producto-info">
                          <span className="pedido-producto-nombre">
                            {producto.nombre}
                            {producto.plataforma && (
                              <span className="pedido-producto-plataforma"> ({producto.plataforma})</span>
                            )}
                          </span>
                          <span className="pedido-producto-cantidad">Cantidad: {producto.cantidad}</span>
                        </div>
                        <span className="pedido-producto-precio">{producto.precio} €</span>
                      </div>
                    ))}
                  </div>

                {pedido.envio && (
                  <div className="pedido-envio">
                    <h4 className="pedido-envio-titulo">Información de envío</h4>
                    <p className="pedido-envio-datos">
                      {pedido.envio.calle}, {pedido.envio.numeroCasa}<br />
                      {pedido.envio.codigoPostal} {pedido.envio.ciudad}<br />
                      {pedido.envio.region === 'canarias' ? 'Islas Canarias' : 'Península y Baleares'}
                      {pedido.envio.telefono && ` • Tel: +34 ${pedido.envio.telefono}`}
                    </p>
                  </div>
                )}
                  
                  <div className="pedido-footer">
                    <span className="pedido-total-label">Total:</span>
                    <span className="pedido-total-valor">{pedido.total} €</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Orders;