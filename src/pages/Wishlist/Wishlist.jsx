import { useWishlist } from "../../api/useWishlist";
import useUserStore from "../../stores/userStore";
import getImageUrl from "../../utils/getImage";
import ProductCard from "../../components/ProductCard/ProductCard";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const Wishlist = () => {
    const userId = useUserStore.getState().id;
    const { wishlist, loading } = useWishlist(userId);
    const getTipoProducto = (producto) => {
      if (producto.tipo === "juego") return "videojuegos";
      if (producto.tipo === "consola") return "consolas";
      if (producto.tipo === "merchandising") return "merchandising";
      return tipo;
    };
    return (
      <>
        <Header />
        <div>
            {loading ? (
                <p>Cargando wishlist...</p>
            ) : (
                wishlist.length > 0 ? (
                    <ul>
                        {wishlist.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                imagen={getImageUrl(product.imagen_url)}
                                nombre={product.nombre}
                                precio={product.precio}
                                tipo={getTipoProducto(product)}
                            />
                        ))}
                    </ul>
                ) : (
                    <p>No hay wishlist</p>
                )
            )}
        </div>
        <Footer />
      </>
    );
};


export default Wishlist;