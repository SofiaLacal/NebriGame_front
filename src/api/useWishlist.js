import { useState, useEffect } from "react";

const useWishlist = (userId) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchWishlist = (signal) => {

        if (!userId) {
            setLoading(false);
            return Promise.resolve();
        }

        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        const opts = signal ? { signal } : {};

        return fetch(`${apiUrl}/usuarios/${userId}/wishlist`, opts)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })

            .then(data => {
                const productIds = data.wishlist.map(item => item.producto_id);
                const productPromises = productIds.map(productId =>
                    fetch(`${apiUrl}/producto/${productId}`, opts)
                        .then(res => {
                            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                            return res.json();
                        })

                        .then(data => data.producto)

                        .catch(err => {
                            if (err.name !== 'AbortError') console.error(`Error fetching product ${productId}:`, err);
                            return null;
                        })
                );

                return Promise.all(productPromises);
            })

            .then(products => {
                setWishlist(products.filter(product => product !== null));
                setLoading(false);
            })

            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error('Error fetching wishlist:', err);
                setWishlist([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchWishlist(controller.signal);

        return () => controller.abort();
    }, [userId]);

    const refetchWishlist = () => {
        fetchWishlist(undefined);
    };
    
    return { wishlist, loading, refetchWishlist };
};

const useAddWishlist = async (userId, productoId) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}/wishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ producto_id: productoId })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al añadir a la wishlist');
        }

        return data;

    } catch (err) {
        console.error('Error adding to wishlist:', err);
        throw err;
    }
};

const useDeleteWishlist = async (userId, productoId) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}/wishlist/${productoId}`, {
            method: 'DELETE'
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al eliminar de la wishlist');
        }

        return data;

    } catch (err) {
        if (err.name !== 'AbortError') console.error('Error deleting from wishlist:', err);
        throw err;
    }
};

const useIsInWishlist = (userId, productId) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

        if (!userId || !productId) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

        fetch(`${apiUrl}/usuarios/${userId}/wishlist`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })

            .then(data => {
                const productIds = data.wishlist.map(item => item.producto_id);
                setIsInWishlist(productIds.includes(parseInt(productId)));
                setLoading(false);
            })

            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error('Error checking wishlist:', err);
                setIsInWishlist(false);
                setLoading(false);
            });

        return () => controller.abort();
        
    }, [userId, productId]);
    
    return { isInWishlist, loading };
};
export { useWishlist, useAddWishlist, useDeleteWishlist, useIsInWishlist };