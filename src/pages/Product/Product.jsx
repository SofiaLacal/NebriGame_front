import Header from "../../components/Header/Header"
import { useVideojuegos, useConsolas, useMerchandising } from "../../api/useProduct";
import ProductCard from "../../components/ProductCard/ProductCard"
import Loading from "../../components/Loading/Loading"
import { useParams } from "react-router-dom";
import "./Product.css"


function Product() {
  const { tipo } = useParams();

  const { videojuegos, loading: loadingVideojuegos } = useVideojuegos();
  const { consolas, loading: loadingConsolas } = useConsolas();
  const { merchandising, loading: loadingMerch } = useMerchandising();

  return (
    <div>
      <Header />
      {/* !!!!!!!!!! F U T U R O   B U S C A D O R !!!!!!!!!! */}
      
      {tipo === "videojuegos" && (
        <>
          {loadingVideojuegos ? (
            <Loading />
          ) : (
            <section>
              <div className="productos-grid">
                {videojuegos.map((v) => (
                  <ProductCard
                    key={v.id}
                    imagen={v.imagen_url}
                    nombre={v.nombre}
                    precio={v.precio}
                    tipo="videojuego"
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {tipo === "consolas" && (
        <>
          {loadingConsolas ? (
            <Loading />
          ) : (
            <section>
              <div className="productos-grid">
                {consolas.map((c) => (
                  <ProductCard
                    key={c.id}
                    imagen={c.imagen_url}
                    nombre={c.nombre}
                    precio={c.precio}
                    tipo="consola"
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {tipo === "merchandising" && (
        <>
          {loadingMerch ? (
            <Loading />
          ) : (
            <section>
              <div className="productos-grid">
                {merchandising.map((m) => (
                  <ProductCard
                    key={m.id}
                    imagen={m.imagen_url}
                    nombre={m.nombre}
                    precio={m.precio}
                    tipo="merchandising"
                />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default Product;