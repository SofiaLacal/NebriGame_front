//Página para montar todos los componentes!!!!

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
}

export default App;