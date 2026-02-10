import { useState, useEffect } from 'react';
import { useCart } from '../../api/useCart';
import { usePayment, useAddPaymentMethod, useDeletePaymentMethod } from '../../api/usePayment';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import SimpleHeader from '../../components/SimpleHeader/SimpleHeader';
import useUserStore from '../../stores/userStore';


function Payment() {
    const navigate = useNavigate();
    const userId = useUserStore.getState().id;
    const { cart } = useCart(userId);
    const [productosCarrito, setProductosCarrito] = useState([]);
    const { payment, loading: paymentLoading, refetchPayment } = usePayment(userId);
    const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);
    console.log(payment);
    useEffect(() => {
        if (cart && cart.length > 0) {
            const productos = cart.map((item) => {
                const producto = item.producto || {};
                return {
                    id: item.id,
                    producto_id: item.producto_id,
                    nombre: producto.nombre || 'Producto',
                    precio: parseFloat(producto.precio || 0),
                    cantidad: item.cantidad
                };
            });
            setProductosCarrito(productos);
        } else {
            setProductosCarrito([]);
        }
    }, [cart]);
    const handleAddPaymentMethod = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const tipo = formData.get('tipo')?.toString().trim();
        const detalles = formData.get('detalles')?.toString().trim();
        if (!tipo || !detalles) {
            return;
        }
        try {
            await useAddPaymentMethod(userId, tipo, detalles);
            setIsAddingPaymentMethod(false);
            e.target.reset();
            refetchPayment();
        } catch (error) {
            console.error('Error adding payment method:', error);
        }
    };

    const deletePaymentMethod = async (metodoId) => {
        try {
            await useDeletePaymentMethod(userId, metodoId);
            refetchPayment();
        } catch (error) {
            console.error('Error deleting payment method:', error);
        }
    };
    const toggleAddPaymentMethod = () => {
        if(isAddingPaymentMethod) {
            setIsAddingPaymentMethod(false);
        } else {
            setIsAddingPaymentMethod(true);
        }
    }
    return (
        <div className='payment-page'>
            <SimpleHeader />
            <div className='payment-container'>
                <div className='payment-header'>
                    <h1>Pago</h1>
                    <div className='payment-methods'>
                        {paymentLoading ? (
                            <p>Cargando métodos de pago...</p>
                        ) : payment.length === 0 ? (
                            <p>No tienes métodos de pago guardados.</p>
                        ) : payment.map((method) => (
                            <div className='payment-method' key={method.id}>
                                <h2>{method.tipo}</h2>
                                <p>{method.detalles}</p>
                                <button onClick={() => deletePaymentMethod(method.id)}>Eliminar método</button>
                            </div>
                        ))}
                        <button className='payment-method-button' onClick={toggleAddPaymentMethod}>Añadir método de pago</button>
                        <form className={isAddingPaymentMethod ? 'add-payment-method-form' : 'hidden'} onSubmit={handleAddPaymentMethod}>    
                            <input type='text' name='tipo' placeholder='Tipo de método de pago' />
                            <input type='text' name='detalles' placeholder='Detalles del método de pago' />
                            <button type='submit'>Añadir método de pago</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Payment;