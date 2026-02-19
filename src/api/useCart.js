import { useState, useEffect } from "react";

const useCart = (userId) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

        if (!userId) {
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

const useAddCart = async (userId, productoId, cantidad, plataformaId = null) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    const body = { producto_id: productoId, cantidad: cantidad ?? 1 };

    if (plataformaId != null && plataformaId !== 0) {
        body.plataforma_id = plataformaId;
    }

    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}/carrito`, {
            headers: {
                'Content-Type': 'application/json'
            },
        method: 'POST',
        body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            const msg = data.stockDisponible !== undefined
                ? `${data.error || 'Stock insuficiente'}. Disponible: ${data.stockDisponible}`
                : (data.error || 'Error al añadir al carrito');
            throw new Error(msg);
        }

        return data;

    } catch (err) {
        console.error('Error adding to cart:', err);
        throw err;
    }
};

const useChangeQuantity = async (userId, productoId, cantidad, plataformaId = 0) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    const body = { cantidad };

    if (plataformaId != null) body.plataforma_id = plataformaId;

    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}/carrito/${productoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            const msg = data.stockDisponible !== undefined
                ? `${data.error || 'Stock insuficiente'}. Disponible: ${data.stockDisponible}`
                : (data.error || 'Error al actualizar cantidad del producto');
            throw new Error(msg);
        }

        return data;

    } catch (err) {
        console.error('Error updating quantity:', err);
        throw err;
    }
};

const useDeleteCart = async (userId, productoId, plataformaId = 0) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

    const url = new URL(`${apiUrl}/usuarios/${userId}/carrito/${productoId}`);

    if (plataformaId != null) url.searchParams.set('plataforma_id', plataformaId);

    try {
        const res = await fetch(url.toString(), {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plataforma_id: plataformaId })
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

const validateCartStock = async (userId) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    const res = await fetch(`${apiUrl}/usuarios/${userId}/carrito/validar-stock`);
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.error || 'Error al validar stock');
    return data;
};

export { useCart, useAddCart, useChangeQuantity, useDeleteCart, validateCartStock };