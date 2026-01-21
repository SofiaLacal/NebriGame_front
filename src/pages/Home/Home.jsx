import './Home.css'
import { useEffect, useState } from "react";

function Home() {

  const [videojuegos, setVideojuegos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4004/videojuegos")
      .then(res => res.json())
      .then(data => setVideojuegos(data.videojuegos))
      .catch(err => console.error(err));
  }, []);

/*   const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const featuredProducts = products.slice(0, 4) */

  return (
    
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1> Esto es la página HOME </h1>
          <h1>NebriGame 🎮 - PRUEBA CON BDD</h1>

          <div className="hero-content">
            {videojuegos.length === 0 ? (<p>Cargando videojuegos...</p>) : 
            (
              <ul>
                {videojuegos.map((juego) => (
                  <li key={juego.id}>
                    {juego.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>⭐ Productos Destacados</h2>
      </section>

      {/* Categories Filter */}
      <section className="categories-section">
        <h2>📦 Explorar por Categoría</h2>
      </section>

    </div>
  )
}


export default Home
