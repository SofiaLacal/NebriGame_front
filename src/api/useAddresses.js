import { useState, useEffect } from "react";

const useAddresses = (userId) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = (signal) => {

    if (!userId) {
      setAddresses([]);
      setLoading(false);
      return Promise.resolve();
    }

    setLoading(true);
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    const opts = signal ? { signal } : {};

    return fetch(`${apiUrl}/usuarios/${userId}/direcciones`, opts)
      .then((res) => {

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })

      .then((data) => {
        setAddresses(data.direcciones || []);
        setLoading(false);
      })

      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching addresses:", err);
        }
        setAddresses([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchAddresses(controller.signal);

    return () => controller.abort();
  }, [userId]);

  const refetchAddresses = () => {
    fetchAddresses(undefined);
  };

  return { addresses, loading, refetchAddresses };
};

const useAddAddress = async (userId, data) => {
  const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

  try {
    const res = await fetch(`${apiUrl}/usuarios/${userId}/direcciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Error al añadir dirección");
    }

    return result;

  } catch (err) {

    console.error("Error adding address:", err);
    throw err;
  }
};

const useDeleteAddress = async (userId, direccionId) => {

  const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

  try {
    const res = await fetch(
      `${apiUrl}/usuarios/${userId}/direcciones/${direccionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al eliminar dirección");
    }

    return data;

  } catch (err) {
    console.error("Error deleting address:", err);
    throw err;
  }
};

export { useAddresses, useAddAddress, useDeleteAddress };
