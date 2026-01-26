import { useState, useEffect } from "react";

const useOrders = (userId) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/usuarios/${userId}/historial-compras`)
        .then(res => res.json())
        .then(data => setOrders(data.pedidos || []))
        .catch(err => console.error(err));
    }, []);
    return { orders, loading };
};