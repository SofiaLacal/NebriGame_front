import { useState, useEffect } from "react";

const useWishlist = (userId) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        
        // Primero obtenemos la lista de IDs de productos en la wishlist
        fetch(`${apiUrl}/usuarios/${userId}/wishlist`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                // Extraemos los IDs de productos
                const productIds = data.wishlist.map(item => item.producto_id);
                
                // Hacemos todas las llamadas en paralelo usando Promise.all
                const productPromises = productIds.map(productId => 
                    fetch(`${apiUrl}/producto/${productId}`)
                        .then(res => {
                            if (!res.ok) {
                                throw new Error(`HTTP error! status: ${res.status}`);
                            }
                            return res.json();
                        })
                        .then(data => data.producto)
                        .catch(err => {
                            console.error(`Error fetching product ${productId}:`, err);
                            return null;
                        })
                );
                
                // Esperamos a que todas las promesas se resuelvan
                return Promise.all(productPromises);
            })
            .then(products => {
                // Filtramos los productos nulos (en caso de errores)
                setWishlist(products.filter(product => product !== null));
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching wishlist:', err);
                setWishlist([]);
                setLoading(false);
            });
    }, [userId]);
    
    return { wishlist, loading };
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
        console.error('Error deleting from wishlist:', err);
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
        
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        // Obtenemos la wishlist completa y verificamos si el producto está en ella
        fetch(`${apiUrl}/usuarios/${userId}/wishlist`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                // Verificamos si el producto está en la wishlist
                const productIds = data.wishlist.map(item => item.producto_id);
                setIsInWishlist(productIds.includes(parseInt(productId)));
                setLoading(false);
            })
            .catch(err => {
                console.error('Error checking wishlist:', err);
                setIsInWishlist(false);
                setLoading(false);
            });
    }, [userId, productId]);
    
    return { isInWishlist, loading };
};
export { useWishlist, useAddWishlist, useDeleteWishlist, useIsInWishlist };