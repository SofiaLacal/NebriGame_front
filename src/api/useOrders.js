import { useState, useEffect } from "react";

const useOrders = (userId) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!userId) {
            setOrders([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

        fetch(`${apiUrl}/usuarios/${userId}/historial-compras`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })

            .then(data => {
                setOrders(data.pedidos || []);
                setLoading(false);
            })

            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error('Error fetching orders:', err);
                setOrders([]);
                setLoading(false);
            });

        return () => controller.abort();

    }, [userId]);

    return { orders, loading };
};

// Crear un nuevo pedido
const createOrder = async (userId, orderData) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    
    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}/carrito/comprar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || data.message || `Error al crear pedido`);
        }

        return data;
        
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export { useOrders, createOrder };