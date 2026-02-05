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

const useAddWishlist = (userId, productoId) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    fetch(`${apiUrl}/usuarios/${userId}/wishlist`, {
        method: 'POST',
        body: JSON.stringify({ producto_id: productoId })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
};

const useDeleteWishlist = (userId, productoId) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    fetch(`${apiUrl}/usuarios/${userId}/wishlist/${productoId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
};

export { useWishlist, useAddWishlist, useDeleteWishlist };