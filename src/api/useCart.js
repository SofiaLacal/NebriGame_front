import { useState, useEffect } from "react";

const useCart = (userId) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/usuarios/${userId}/carrito`)
        .then(res => res.json())
        .then(data => setCart(data.cart || []))
        .catch(err => console.error(err));
    }, []);
    return { cart, loading };
};

const useAddCart = (userId, productoId, cantidad) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    fetch(`${apiUrl}/usuarios/${userId}/carrito`, {
        method: 'POST',
        body: JSON.stringify({ producto_id: productoId, cantidad: cantidad })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
};

const useChangeQuantity = (userId, productoId, cantidad) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    fetch(`${apiUrl}/usuarios/${userId}/carrito/${productoId}`, {
        method: 'PUT',
        body: JSON.stringify({ cantidad: cantidad })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
};

const useDeleteCart = (userId, productoId) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    fetch(`${apiUrl}/usuarios/${userId}/carrito/${productoId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
};

export default { useCart, useAddCart, useChangeQuantity, useDeleteCart };