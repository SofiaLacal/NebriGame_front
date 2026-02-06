import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useVideojuegos, useConsolas, useMerchandising } from "../../api/useProduct";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ProductCard from "../../components/ProductCard/ProductCard";
import Search from "../../components/Search/Search";
import Loading from "../../components/Loading/Loading";
import getImageUrl from "../../utils/getImage";
import "./Product.css";

function Product() {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [busqueda, setBusqueda] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [ordenActual, setOrdenActual] = useState("defecto");

  const { videojuegos, loading: loadingVideojuegos } = useVideojuegos();
  const { consolas, loading: loadingConsolas } = useConsolas();
  const { merchandising, loading: loadingMerch } = useMerchandising();

  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setBusqueda(query);
      realizarBusqueda(query);
    } else {
      setBusqueda("");
      setBuscando(false);
      setResultados([]);
    }
  }, [searchParams]);

  const realizarBusqueda = async (termino) => {
    if (!termino.trim()) {
      setBuscando(false);
      setResultados([]);
      return;
    }

    setBuscando(true);
    const apiUrl = import.meta.env.VITE_BACK_CONNECTION;
    
    try {
      const res = await fetch(`${apiUrl}/buscar?q=${encodeURIComponent(termino)}`);
      const data = await res.json();
      
      if (data.success) {
        setResultados(data.resultados);
      }
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setResultados([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!busqueda.trim()) {
      if (tipo) {
        navigate(`/productos/${tipo}`);
      } else {
        navigate('/productos');
      }
      setBuscando(false);
      setResultados([]);
      return;
    }

    navigate(`/productos?query=${encodeURIComponent(busqueda)}`);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setBuscando(false);
    setResultados([]);
    setOrdenActual("defecto");
    
    if (tipo) {
      navigate(`/productos/${tipo}`);
    } else {
      navigate('/productos');
    }
  };

  const handleOrdenarChange = (nuevoOrden) => {
    setOrdenActual(nuevoOrden);
  };

  const ordenarProductos = (productos) => {
    const productosOrdenados = [...productos];

    switch(ordenActual) {
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
    else if (tipo === "consolas") productos = consolas;
    else if (tipo === "merchandising") productos = merchandising;
    else {
      productos = [...videojuegos, ...consolas, ...merchandising];
    }
    
    return ordenarProductos(productos);
  };

  const isLoading = () => {
    if (tipo === "videojuegos") return loadingVideojuegos;
    if (tipo === "consolas") return loadingConsolas;
    if (tipo === "merchandising") return loadingMerch;
    return loadingVideojuegos || loadingConsolas || loadingMerch;
  };

  const getTipoProducto = (producto) => {
    if (producto.tipo === "juego") return "videojuegos";
    if (producto.tipo === "consola") return "consolas";
    if (producto.tipo === "merchandising") return "merchandising";
    return tipo || "videojuegos";
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
        onOrdenarChange={handleOrdenarChange}
        onLimpiarFiltros={limpiarFiltros}
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