import { Routes, Route } from "react-router-dom";
import WebRoutes from "./router/WebRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<WebRoutes />} />
      </Routes>
    </>
  );
}

export default App;