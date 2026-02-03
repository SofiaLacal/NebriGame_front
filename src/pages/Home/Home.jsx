import './Home.css'
import { useVideojuegos, useConsolas, useMerchandising } from "../../api/useProduct";  
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import getImageUrl from "../../utils/getImage";

function Home() {

  const { videojuegos } = useVideojuegos();
  const { consolas } = useConsolas();
  const { merchandising } = useMerchandising();

  // Combinar todos los productos
  const todosLosProductos = [
    ...videojuegos.map(v => ({ ...v, tipo: 'videojuegos' })),
    ...consolas.map(c => ({ ...c, tipo: 'consolas' })),
    ...merchandising.map(m => ({ ...m, tipo: 'merchandising' }))
  ];

  // IDs de los productos que queremos
  const productosDestacadosIds = [1, 6, 13, 16, 17, 23];
  
  // Filtrar solo los productos destacados puestos arriba
  const productosDestacados = todosLosProductos.filter(producto => 
    productosDestacadosIds.includes(producto.id)
  );

  return (
    <>
      <div className="background">
        <Header/>
          <div className="welcome">
            <section className="hero">
              <h1>Bienvenido a NebriGame</h1>
              <p>Tu tienda online de videojuegos, consolas y merchandising. <br/>
                Encuentra todo lo que necesitas con un sólo click.
                Compra ahora o reserva los últimos lanzamientos.
              </p>
            </section>
          </div>
      </div>

      <div className="home-container">
        <section className="featured-section">
          <div className="section-name">
            <h2> Productos Destacados</h2>
          </div>
                    
          <div className="productos-grid">
            {productosDestacados.map((producto) => (
              <ProductCard
                key={producto.id}
                id={producto.id}
                imagen={getImageUrl(producto.imagen_url)}
                nombre={producto.nombre}
                precio={producto.precio}
                tipo={producto.tipo}
              />
            ))}
          </div>
        </section>
      </div>

    <Footer/>
  </>
  )
}


export default Home