import { useState, useEffect } from "react";


const useVideojuegos = () => {
    const [videojuegos, setVideojuegos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

        fetch(`${apiUrl}/videojuegos`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })

            .then(data => {
                setVideojuegos(data.videojuegos || []);
                setLoading(false);
            })

            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error('Error fetching videojuegos:', err);
                setVideojuegos([]);
                setLoading(false);
            });

        return () => controller.abort();

    }, []);

    return { videojuegos, loading };
};

const useProductStock = (productoId) => {
    const [stockData, setStockData] = useState({ stock: 0, plataformas: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!productoId) {
            setStockData({ stock: 0, plataformas: null });
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

        fetch(`${apiUrl}/producto/${productoId}/stock`, { signal: controller.signal })
            .then(res => res.ok ? res.json() : Promise.reject(new Error("Error al obtener stock")))

            .then(data => {
                setStockData({
                    stock: data.stock ?? 0,
                    plataformas: data.plataformas ?? null
                });
            })

            .catch(() => {
                setStockData({ stock: 0, plataformas: null });
            })

            .finally(() => setLoading(false));

        return () => controller.abort();

    }, [productoId]);

    return { ...stockData, loading };
};

const useOneProduct = (id) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

        fetch(`${apiUrl}/producto/${id}`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })

            .then(data => {
                setProduct(data.producto);
                setLoading(false);
            })

            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error('Error fetching product:', err);
                setProduct(null);
            });

        return () => controller.abort();

    }, [id]);

    return { product, loading };
};

const useConsolas = () => {
    const [consolas, setConsolas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

        fetch(`${apiUrl}/consolas`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })

            .then(data => {
                setConsolas(data.consolas || []);
                setLoading(false);
            })

            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error('Error fetching consolas:', err);
                setConsolas([]);
                setLoading(false);
            });

        return () => controller.abort();

    }, []);

    return { consolas, loading };
};

const useMerchandising = () => {
    const [merchandising, setMerchandising] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

        fetch(`${apiUrl}/merchandising`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })

            .then(data => {
                setMerchandising(data.merchandising || []);
                setLoading(false);
            })

            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error('Error fetching merchandising:', err);
                setMerchandising([]);
                setLoading(false);
            });

        return () => controller.abort();

    }, []);

    return { merchandising, loading };
};

const useSearch = (busqueda) => {
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!busqueda || busqueda.trim() === "") {
            setResultados([]);
            return;
        }
        const controller = new AbortController();
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

        fetch(`${apiUrl}/buscar?q=${encodeURIComponent(busqueda)}`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })

            .then(data => {
                setResultados(data.resultados || []);
                setLoading(false);
            })

            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error('Error en búsqueda:', err);
                setResultados([]);
                setLoading(false);
            });

        return () => controller.abort();
        
    }, [busqueda]);

    return { resultados, loading };
};

export { useVideojuegos, useConsolas, useMerchandising, useSearch, useOneProduct, useProductStock };