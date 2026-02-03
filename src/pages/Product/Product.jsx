import { useVideojuegos, useConsolas, useMerchandising } from "../../api/useProduct";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ProductCard from "../../components/ProductCard/ProductCard";
import Search from "../../components/Search/Search";
import Loading from "../../components/Loading/Loading";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Product.css";
import getImageUrl from "../../utils/getImage";

function Product() {
  const { tipo } = useParams();
  const [busqueda, setBusqueda] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [ordenar, setOrdenar] = useState("defecto");

  const limpiarFiltros = () => {
    setBusqueda("");
    setBuscando(false);
    setResultados([]);
    setOrdenar("defecto");
  };

  const hayFiltros = ordenar !== "defecto" || busqueda.trim() !== "" || buscando;

  const { videojuegos, loading: loadingVideojuegos } = useVideojuegos();
  const { consolas, loading: loadingConsolas } = useConsolas();
  const { merchandising, loading: loadingMerch } = useMerchandising();

  // Limpiar búsqueda cuando cambias de pestaña
  useEffect(() => {
    setBusqueda("");
    setBuscando(false);
    setResultados([]);
  }, [tipo]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!busqueda.trim()) {
      setBuscando(false);
      setResultados([]);
      return;
    }

    setBuscando(true);
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    
    try {
      const res = await fetch(`${apiUrl}/buscar?q=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      
      if (data.success) {
        setResultados(data.resultados);
      }
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setResultados([]);
    }
  };

  const ordenarProductos = (productos) => {
    const productosOrdenados = [...productos];

    switch(ordenar) {
      case "precio-asc":
        return productosOrdenados.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
      case "precio-desc":
        return productosOrdenados.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
      case "nombre-asc":
        return productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case "nombre-desc":
        return productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
      default:
        return productosOrdenados;
    }
  };

  const getProductosToShow = () => {
    if (buscando) {
      return ordenarProductos(resultados);
    }
    
    let productos = [];
    if (tipo === "videojuegos") productos = videojuegos;
    if (tipo === "consolas") productos = consolas;
    if (tipo === "merchandising") productos = merchandising;
    
    return ordenarProductos(productos);
  };

  const isLoading = () => {
    if (tipo === "videojuegos") return loadingVideojuegos;
    if (tipo === "consolas") return loadingConsolas;
    if (tipo === "merchandising") return loadingMerch;
    return false;
  };

  const getTipoProducto = (producto) => {
    if (producto.tipo === "juego") return "videojuegos";
    if (producto.tipo === "consola") return "consolas";
    if (producto.tipo === "merchandising") return "merchandising";
    return tipo;
  };

  const productos = getProductosToShow();

  return (
    <div>
      <Header />
      <Search
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        handleSearch={handleSearch}
        buscando={buscando}
        resultadosCount={productos.length}
        ordenar={ordenar}
        setOrdenar={setOrdenar}
        onLimpiarFiltros={limpiarFiltros}
        hayFiltros={hayFiltros}
      />

      {isLoading() ? (
        <Loading />
      ) : (
        <section>
          <div className="productos-grid">
            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                id={producto.id}
                imagen={getImageUrl(producto.imagen_url)}
                nombre={producto.nombre}
                precio={producto.precio}
                tipo={buscando ? getTipoProducto(producto) : tipo}
              />
            ))}
          </div>
          {productos.length === 0 && buscando && (
            <p style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
              No se encontraron resultados
            </p>
          )}
        </section>
      )}
      
      <Footer />
    </div>
  );
}

export default Product;