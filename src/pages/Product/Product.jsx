import Header from "../../components/Header/Header"
import { useVideojuegos, useConsolas, useMerchandising } from "../../api/useProduct";
import ProductCard from "../../components/ProductCard/ProductCard"


function Product() {
  const { tipo } = useParams();

  const { videojuegos, loading: loadingVideojuegos } = useVideojuegos();
  const { consolas, loading: loadingConsolas } = useConsolas();
  const { merchandising, loading: loadingMerch } = useMerchandising();

  if (loadingVideojuegos || loadingConsolas || loadingMerch) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div>
      <Header />

      {tipo === "videojuegos" && (
        <section>
          <h2>Videojuegos</h2>
          <div className="grid">
            {videojuegos.map((v) => (
              <ProductCard
                key={v.id}
                imagen={v.imagen}
                nombre={v.nombre}
                precio={v.precio}
                tipo="videojuego"
              />
            ))}
          </div>
        </section>
      )}

      {tipo === "consolas" && (
        <section>
          <h2>Consolas</h2>
          <div className="grid">
            {consolas.map((c) => (
              <ProductCard
                key={c.id}
                imagen={c.imagen}
                nombre={c.nombre}
                precio={c.precio}
                tipo="consola"
              />
            ))}
          </div>
        </section>
      )}

      {tipo === "merchandising" && (
        <section>
          <h2>Merchandising</h2>
          <div className="grid">
            {merchandising.map((m) => (
              <ProductCard
                key={m.id}
                imagen={m.imagen}
                nombre={m.nombre}
                precio={m.precio}
                tipo="merchandising"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Product;