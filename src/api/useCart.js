import { useState, useEffect } from "react";

const useCart = (userId) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/usuarios/${userId}/carrito`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                // The API returns { success: true, total: number, carrito: [...] }
                setCart(data.carrito || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching cart:', err);
                setCart([]);
                setLoading(false);
            });
    }, [userId]);
    
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

const useDeleteCart = async (userId, productoId) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}/carrito/${productoId}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Error al eliminar del carrito');
        }
        return data;
    } catch (err) {
        console.error('Error deleting from cart:', err);
        throw err;
    }
};


export { useCart, useAddCart, useChangeQuantity, useDeleteCart };