import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useVideojuegos, useConsolas, useMerchandising } from "../../api/useProduct";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ProductCard from "../../components/ProductCard/ProductCard";
import SearchFilter from "../../components/SearchFilter/SearchFilter";
import Loading from "../../components/Loading/Loading";
import getImageUrl from "../../utils/getImage";
import imagenUps from "../../assets/images/ups.jpg";
import "./Product.css";
import { useLocation } from "react-router-dom";
function Product() {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const location = useLocation();
  const from = location.state?.from;
  const validFrom = ['/productos/consolas', '/productos/videojuegos', '/productos/merchandising'].includes(from) ? from : null;

  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [ordenar, setOrdenar] = useState("defecto");
  const [busqueda, setBusqueda] = useState("");

  const { videojuegos, loading: loadingVideojuegos } = useVideojuegos();
  const { consolas, loading: loadingConsolas } = useConsolas();
  const { merchandising, loading: loadingMerch } = useMerchandising();

  useEffect(() => {
    const query = searchParams.get('query');
    
    if (query) {
      setBusqueda(query);
      realizarBusqueda(query);

    } else {
      setBuscando(false);
      setResultados([]);
      setBusqueda("");
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

  const limpiarBusqueda = () => {
    setBuscando(false);
    setResultados([]);
    setOrdenar("defecto");
    navigate(validFrom || '/', { replace: true });
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
      <Header busqueda={busqueda} setBusqueda={setBusqueda} />
      
      {/* SearchFilter solo aparece cuando hay búsqueda activa */}
      {buscando && (
        <SearchFilter
          resultadosCount={productos.length}
          busqueda={busqueda}
          ordenar={ordenar}
          setOrdenar={setOrdenar}
          onLimpiar={limpiarBusqueda}
        />
      )}

      {/* Contenido principal */}
      {isLoading() ? (
        <Loading />
      ) : productos.length === 0 && buscando ? (
        <div className="no-encontrado-pantalla">
          <img 
            src={imagenUps} 
            alt="No se encontraron productos"
            className="no-encontrado-imagen"
          />
        </div>
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
        </section>
      )}
      
      <Footer />
    </div>
  );
}

export default Product;