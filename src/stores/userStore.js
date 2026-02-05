import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
    persist(
        (set) => ({
            id: null,
            nombre: null,
            apellido1: null,
            apellido2: null,
            email: null,
            fecha_registro: null,
            setUsuario: (id, nombre, apellido1, apellido2, email, fecha_registro) => 
                set({ id, nombre, apellido1, apellido2, email, fecha_registro }),
            logout: () => set({ id: null, nombre: null, apellido1: null, apellido2: null, email: null, fecha_registro: null }),
        }),
        {
            name: 'user-storage', // nombre de la clave en localStorage
        }
    )
);

export default useUserStore;