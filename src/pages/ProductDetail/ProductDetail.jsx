import { useParams } from "react-router-dom";
import { useVideojuegos, useConsolas, useMerchandising } from "../../api/useProduct";
import { Heart } from 'lucide-react';
import Header from "../../components/Header/Header";
import Loading from "../../components/Loading/Loading";
import "./ProductDetail.css";
import Footer from "../../components/Footer/Footer";

function ProductDetail() {
  const { id, tipo } = useParams();
  
  const { videojuegos, loading: loadingVideojuegos } = useVideojuegos();
  const { consolas, loading: loadingConsolas } = useConsolas();
  const { merchandising, loading: loadingMerch } = useMerchandising();

  let data = [];
  let loading = false;
  
  if (tipo === "videojuegos") {
    data = videojuegos;
    loading = loadingVideojuegos;
  } else if (tipo === "consolas") {
    data = consolas;
    loading = loadingConsolas;
  } else if (tipo === "merchandising") {
    data = merchandising;
    loading = loadingMerch;
  }

  const producto = data.find(p => p.id === parseInt(id));

  if (loading) {
    return (
      <div>
        <Header />
        <Loading />
      </div>
    );
  }

  if (!producto) {
    return (
      <div>
        <Header />
        <div className="contenedor-detalle">
          <p style={{ color: 'white', textAlign: 'center' }}>Producto no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="contenedor-detalle">
        <div className="detalle">
          <div>
            <img src={producto.imagen_url} alt={producto.nombre} className="imagen" />
          </div>
          <div className="info">
            <h1>{producto.nombre}</h1>
            <p className="precio">{producto.precio} €</p>
            
            <div className="botones">
              <button className="boton-wishlist">
                <Heart size={24} />
              </button>
              <button className="boton-carrito">Añadir a la cesta</button>
            </div>
          </div>
        </div>
        
        <div className="seccion-descripcion">
          <h2>Acerca de</h2>
          <p className="descripcion">
            {producto.descripcion || "Descripción no disponible"}
          </p>

          <div className="especificaciones">
            {tipo === "videojuegos" && producto.juego && (
              <>
                <div className="dato">
                  <span className="etiqueta">Género:</span>
                  <span className="valor">{producto.juego.genero}</span>
                </div>
                <div className="dato">
                  <span className="etiqueta">Edad mínima:</span>
                  <span className="valor">{producto.juego.edad_minima}+</span>
                </div>
                {producto.juego.plataformas && producto.juego.plataformas.length > 0 && (
                  <div className="dato">
                    <span className="etiqueta">Plataformas disponibles:</span>
                    <div className="lista-plataformas">
                      {producto.juego.plataformas.map((plataforma) => (
                        <span key={plataforma.id} className="plataforma">
                          {plataforma.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {tipo === "consolas" && producto.consola && (
              <>
                <div className="dato">
                  <span className="etiqueta">Fabricante:</span>
                  <span className="valor">{producto.consola.fabricante}</span>
                </div>
                <div className="dato">
                  <span className="etiqueta">Capacidad:</span>
                  <span className="valor">{producto.consola.capacidad_almacenamiento}</span>
                </div>
                {producto.consola.plataforma && (
                  <div className="dato">
                    <span className="etiqueta">Plataforma:</span>
                    <span className="valor">{producto.consola.plataforma.nombre}</span>
                  </div>
                )}
                {producto.consola.color && (
                  <div className="dato">
                    <span className="etiqueta">Color:</span>
                    <span className="valor">{producto.consola.color}</span>
                  </div>
                )}
              </>
            )}

            {tipo === "merchandising" && producto.merchandising && (
              <div className="dato">
                <span className="etiqueta">Categoría:</span>
                <span className="valor">{producto.merchandising.categoria}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;