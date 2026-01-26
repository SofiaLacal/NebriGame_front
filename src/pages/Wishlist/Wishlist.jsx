import { useWishlist, useAddWishlist, useDeleteWishlist } from "../../api/useWishlist";


const Wishlist = (userId) =>   {
    const { wishlist, loading } = useWishlist(userId);
    const { addWishlist, loading: addWishlistLoading } = useAddWishlist(userId, productoId);
    const { deleteWishlist, loading: deleteWishlistLoading } = useDeleteWishlist(userId, productoId);
    return (
      <div>
        {loading ? <p>Cargando wishlist...</p> : (
          wishlist.length > 0 ? (
              <ul>
              {wishlist.map((item) => (
                <li key={item.id}>{item.nombre}</li>
              ))}
            </ul>
          ) : <p>No hay wishlist</p>
        )}
      </div>
    );
  };


export default Wishlist;