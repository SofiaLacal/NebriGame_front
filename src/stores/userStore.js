import { create } from 'zustand';

const useUserStore = create((set) => ({
    id: null,
    nombre: null,
    apellido1: null,
    apellido2: null,
    email: null,
    fecha_registro: null,
    setUsuario: (id, nombre, apellido1, apellido2, email, fecha_registro) => set({ id, nombre, apellido1, apellido2, email, fecha_registro }),
    logout: () => set({ id: null, nombre: null, apellido1: null, apellido2: null, email: null, fecha_registro: null }),
}));

export default useUserStore;