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

export { useOrders };