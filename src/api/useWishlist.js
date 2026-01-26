import { useState, useEffect } from "react";

const useWishlist = (userId) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/usuarios/${userId}/wishlist`)
        .then(res => res.json())
        .then(data => setWishlist(data.wishlist || []))
        .catch(err => console.error(err));
    }, []);
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

export default { useWishlist, useAddWishlist, useDeleteWishlist };