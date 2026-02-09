/* import { Routes, Route, Navigate } from "react-router-dom";
import Perfil from "../pages/Perfil/Perfil";
import Header from "../components/Header/Header"; */

function PrivateRoutes() {
/* 
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } */

  // Si está autenticado, mostrar las rutas privadas
/*   return (
    <>
      <Header />
      <Routes>
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/carrito" element={<Cart />} />
      </Routes>
    </>
  ); */
}

export default PrivateRoutes;
