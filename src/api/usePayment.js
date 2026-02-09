import { useState, useEffect } from "react";

const usePayment = (userId) => {
    const [payment, setPayment] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/usuarios/${userId}/metodos-pago`)
        .then(res => res.json())
        .then(data => setPayment(data.metodosPago || []))
        .catch(err => console.error(err));
    }, []);
    return { payment, loading };
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