import { useState, useEffect } from "react";


const useVideojuegos = () => {
    const [videojuegos, setVideojuegos] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/videojuegos`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            setVideojuegos(data.videojuegos || []);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching videojuegos:', err);
            setVideojuegos([]);
            setLoading(false);
        });
    }, []);
    return { videojuegos, loading };
};


const useConsolas = () => {
    const [consolas, setConsolas] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/consolas`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            setConsolas(data.consolas || []);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching consolas:', err);
            setConsolas([]);
            setLoading(false);
        });
    }, []);
    return { consolas, loading };
};

const useMerchandising = () => {
    const [merchandising, setMerchandising] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/merchandising`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            setMerchandising(data.merchandising || []);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching merchandising:', err);
            setMerchandising([]);
            setLoading(false);
        });
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

        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/buscar?q=${encodeURIComponent(busqueda)}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            setResultados(data.resultados || []);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error en búsqueda:', err);
            setResultados([]);
            setLoading(false);
        });
    }, [busqueda]);

    return { resultados, loading };
};

export { useVideojuegos, useConsolas, useMerchandising, useSearch };