import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./router/PublicRoutes";
/* import PrivateRoutes from "./router/PrivateRoutes" */


function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </>
  );
}

export default App;