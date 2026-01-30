import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./router/PublicRoutes";
/* import PrivateRoutes from "./router/PrivateRoutes" */


function App() {
  
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* Rutas privadas */}
      {/* <Route path="/" element={<PrivateRoutes />} /> */}
    </Routes>
  );
}

export default App;