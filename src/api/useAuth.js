const login = async (email, contrasenna) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

    try {
        const res = await fetch(`${apiUrl}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, contrasenna })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al iniciar sesión');
        }

        return data;

    } catch (err) {
        console.error('Error in login:', err);
        throw err;
    }
};

const logout = async () => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

    try {
        const res = await fetch(`${apiUrl}/usuarios/logout`, {
            method: 'POST'
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Error al cerrar sesión');
        }

    } catch (err) {
        console.error('Error in logout:', err);
        throw err;
    }
};

const updateProfile = async (userId, { nombre, apellido1, apellido2, email, contrasenna, contrasennaActual }) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;

    try {
        const res = await fetch(`${apiUrl}/usuarios/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, apellido1, apellido2, email, contrasenna, contrasennaActual })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al actualizar el perfil');
        }
        console.log(data);

        return data;

    } catch (err) {
        console.error('Error updating profile:', err);
        throw err;
    }
};

const deleteProfile = async (userId) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    const id = Number(userId);

    if (isNaN(id) || id <= 0) {
        throw new Error('ID de usuario no válido');
    }

    try {
        const res = await fetch(`${apiUrl}/usuarios/${id}`, {
            method: 'DELETE'
        });
        
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || data.message || 'Error al eliminar el perfil');
        }

    } catch (err) {
        console.error('Error deleting profile:', err);
        throw err;
    }
};

export { login, logout, updateProfile, deleteProfile };