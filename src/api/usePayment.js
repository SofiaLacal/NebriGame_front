import { useState, useEffect } from "react";

const usePayment = (userId) => {
    const [payment, setPayment] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPayment = (signal) => {

        if (!userId) {
            setPayment([]);
            setLoading(false);
            return Promise.resolve();
        }

        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        const opts = signal ? { signal } : {};

        return fetch(`${apiUrl}/usuarios/${userId}/metodos-pago`, opts)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })

            .then(data => {
                setPayment(data.metodosPago || []);
                setLoading(false);
            })

            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error('Error fetching payment methods:', err);
                setPayment([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchPayment(controller.signal);

        return () => controller.abort();

    }, [userId]);

    const refetchPayment = () => {
        fetchPayment(undefined);
    };

    return { payment, loading, refetchPayment };
};


const useAddPaymentMethod = async (userId, tipo, detalles) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}/metodos-pago`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tipo, detalles })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al añadir método de pago');
        }

        return data;

    } catch (err) {
        console.error('Error adding payment method:', err);
        throw err;
    }
};

const useDeletePaymentMethod = async (userId, metodoId) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}/metodos-pago/${metodoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al eliminar método de pago');
        }

        return data;
        
    } catch (err) {
        console.error('Error deleting payment method:', err);
        throw err;
    }
};

export { usePayment, useAddPaymentMethod, useDeletePaymentMethod };