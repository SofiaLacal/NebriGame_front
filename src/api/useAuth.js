import { useState, useEffect } from "react";

const useAuth = () => {
    const login = (email, contrasenna) => {
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/login`, {
            method: 'POST',
            body: JSON.stringify({ email, contrasenna })
        })
    }
    const logout = () => {
        const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
        fetch(`${apiUrl}/logout`, {
            method: 'POST'
        })
    }
    return { login, logout };
}

const updateProfile = (userId, nombre, apellido1, apellido2, DNI, email, contrasenna) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    fetch(`${apiUrl}/usuarios/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ nombre, apellido1, apellido2, DNI, email, contrasenna })
    })
}


const deleteProfile = (userId) => {
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    fetch(`${apiUrl}/usuarios/${userId}`, {
        method: 'DELETE'
    })
}

export default { useAuth, updateProfile, deleteProfile };