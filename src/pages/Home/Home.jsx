import './Home.css'
import { useVideojuegos } from "../../api/useProduct";  
import getImageUrl from '../../utils/getImage';
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer";

function Home() {

  const { videojuegos } = useVideojuegos();

  return (
    <>
      <div className="background">
        <Header/>
          <div className="home">
            {/* Hero Section */}
            <section className="hero">
              <h1>Bienvenido a NebriGame</h1>
              <p>Tu tienda online de videojuegos, consolas y merchandising. <br/>
                Encuentra todo lo que necesitas con un sólo click.
                Compra ahora o reserva los últimos lanzamientos.
              </p>
            </section>
          </div>
      </div>

      <div className="home">
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
                    <img src={getImageUrl(juego.imagen_url)} alt={juego.nombre} />
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

      {/* Categories Filter */}
      <section className="categories-section">
        <h2>📦 Explorar por Categoría</h2>
      </section>

    <Footer/>
  </>
  )
}


export default Home
