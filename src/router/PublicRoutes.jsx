import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Product from "../pages/Product/Product";
import Login from "../pages/LoginRegister/Login";
import Register from "../pages/LoginRegister/Register";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Product />}/>
      <Route path="/login" element= {<Login/>} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/error-500"
        element={
          <NotFound
            code={500}
            title="Internal Server Error"
            message="Oops! Algo ha salido mal. Inténtalo más tarde"
          />
        }
      />

      <Route
        path="/error-403"
        element={
          <NotFound
            code={403}
            title="Forbidden"
            message="Ande vaaaas?"
          />
        }
      />

      <Route
        path="/*"
        element={<NotFound message="La página que buscas no existe" />}
      />
      </Routes>
  );
}

export default PublicRoutes;


{/*       
  <Route path="games" element={<Games />} />
  <Route path="cart" element={<Cart />} />
  <Route path="wishlist" element={<Wishlist />} /> 
*/}