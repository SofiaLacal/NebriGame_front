import { useState, useEffect } from "react";

const useCart = (userId) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!userId) {
            // Sin usuario no tiene sentido mantener el carrito anterior
            setCart([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/usuarios/${userId}/carrito`, { signal: controller.signal })
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
                if (err.name === 'AbortError') return;
                console.error('Error fetching cart:', err);
                setCart([]);
                setLoading(false);
            });

        return () => controller.abort();
    }, [userId]);
    
    return { cart, loading };
};

const useAddCart = async (userId, productoId, cantidad) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}/carrito`, {
            headers: {
                'Content-Type': 'application/json'
            },
        method: 'POST',
        body: JSON.stringify({ producto_id: productoId, cantidad: cantidad })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Error al añadir al carrito');
        }
        return data;
    } catch (err) {
        console.error('Error adding to cart:', err);
        throw err;
    }
};

const useChangeQuantity = async (userId, productoId, cantidad) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}/carrito/${productoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cantidad })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Error al actualizar cantidad del producto');
        }
        return data;
    } catch (err) {
        console.error('Error updating quantity:', err);
        throw err;
    }
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