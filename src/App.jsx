import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./router/PublicRoutes";
import ToastContainer from "./components/Toast/ToastContainer";
import "./style.css";


function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;