import Header from '../../components/Header/Header';
import './Home.css'
import { useEffect, useState } from "react";
import { useVideojuegos } from "../../api/useProduct";  
import Footer from '../../components/Footer/Footer';

function Home() {

  const { videojuegos, loading } = useVideojuegos();

/*   const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const featuredProducts = products.slice(0, 4) */

  return (
    <>
      <Header/>
      <div className="home">
        {/* Hero Section */}
        <section className="hero">
          <h1>NebriGame 🎮 - PRUEBA CON BDD</h1>
        </section>

        {/* Featured Products */}
        <section className="featured-section">
          <h2>⭐ Productos Destacados</h2>
          
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

        {/* Categories Filter */}
        <section className="categories-section">
          <h2>📦 Explorar por Categoría</h2>
        </section>
      </div>

      <Footer />
    </>
  )
}


export default Home
