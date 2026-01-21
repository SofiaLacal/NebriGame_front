//Página para montar todos los componentes!!!!
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound.jsx'
import Home from './pages/Home/Home.jsx';

import { useEffect, useState } from "react";

function App() {

  const [videojuegos, setVideojuegos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4004/videojuegos")
      .then(res => res.json())
      .then(data => setVideojuegos(data.videojuegos))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      {/* Prueba roñosa */}
      <h1>NebriGame 🎮</h1>

      {videojuegos.length === 0 ? (
        <p>Cargando videojuegos...</p>
      ) : (
        <ul>
          {videojuegos.map((juego) => (
            <li key={juego.id}>
              {juego.nombre}
            </li>
          ))}
        </ul>
      )}
    </>
  );
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

/*   return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="games" element={<Games />} />
        <Route index element={<Home />} />
        <Route path="consoles" element={<Consoles />} />
        <Route path="merchandise" element={<Merchandise />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>
    </Routes>
  ) */


export default App