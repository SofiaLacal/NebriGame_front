import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, validateCartStock } from '../../api/useCart';
import { useAddresses, useAddAddress, useDeleteAddress } from '../../api/useAddresses';
import Footer from '../../components/Footer/Footer';
import useUserStore from '../../stores/userStore';
import './Shipping.css';
import CartHeader from '../../components/CartHeader/CartHeader';
import { toast } from '../../stores/toastStore';

function Shipping() {
  const navigate = useNavigate();
  const userId = useUserStore.getState().id;
  const { cart, loading: cartLoading } = useCart(userId);
  const { addresses, loading: addressesLoading, refetchAddresses } = useAddresses(userId);

  const [productosCarrito, setProductosCarrito] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    region: 'peninsula',
    ciudad: '',
    codigoPostal: '',
    calle: '',
    numeroCasa: '',
    telefono: '',
  });

  const [errors, setErrors] = useState({});

  // Sincronizar productos del carrito
  useEffect(() => {
    if (cart && cart.length > 0) {
      const productos = cart.map((item) => {
        const producto = item.producto || {};
        
        return {
          id: item.id,
          nombre: producto.nombre || 'Producto',
          precio: parseFloat(producto.precio || 0),
          cantidad: item.cantidad || 1,
        };
      });

      setProductosCarrito(productos);

    } else {
      setProductosCarrito([]);
    }
  }, [cart]);

  const calcularTotal = () => {
    if (productosCarrito.length === 0) return '0.00';
    return productosCarrito
      .reduce((total, p) => total + p.precio * p.cantidad, 0)
      .toFixed(2);
  };

  const validar = (name, value) => {
    switch (name) {
      case 'ciudad':
        return value.trim() === ''
          ? 'Este campo es obligatorio'
          : /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)
          ? ''
          : 'Solo se permiten letras';

      case 'calle':
        return value.trim() === ''
          ? 'Este campo es obligatorio'
          : /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s,.\-/]+$/.test(value)
          ? ''
          : 'No se permiten caracteres especiales';

      case 'codigoPostal':
        return /^[0-9]{5}$/.test(value)
          ? ''
          : 'Debe tener exactamente 5 dígitos numéricos';

      case 'numeroCasa':
        return value.trim() === ''
          ? 'Este campo es obligatorio'
          : /^[0-9a-zA-Z\-/]+$/.test(value)
          ? ''
          : 'Solo números y letras (ej: 12, 4B)';

      case 'telefono':
        return /^[0-9]{9}$/.test(value)
          ? ''
          : 'Debe tener exactamente 9 dígitos';
      default:
        return '';
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validar(name, value) }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const campos = ['ciudad', 'codigoPostal', 'calle', 'numeroCasa', 'telefono'];
    const newErrors = {};

    campos.forEach((campo) => {
      const err = validar(campo, newAddress[campo]);
      if (err) newErrors[campo] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await useAddAddress(userId, {
        region: newAddress.region,
        ciudad: newAddress.ciudad,
        codigoPostal: newAddress.codigoPostal,
        calle: newAddress.calle,
        numeroCasa: newAddress.numeroCasa,
        telefono: newAddress.telefono,
      });

      setNewAddress({
        region: 'peninsula',
        ciudad: '',
        codigoPostal: '',
        calle: '',
        numeroCasa: '',
        telefono: '',
      });

      setIsAddingAddress(false);
      refetchAddresses();

    } catch (error) {
      console.error('Error añadiendo dirección:', error);
    }
  };

  const handleDeleteAddress = async (direccionId) => {
    try {
      await useDeleteAddress(userId, direccionId);

      if (selectedAddress?.id === direccionId) {
        setSelectedAddress(null);
      }

      refetchAddresses();

    } catch (error) {
      console.error('Error eliminando dirección:', error);
    }
  };

  const navigateToPayment = (direccionCompleta) => {
    navigate('/pago', { state: { direccion: direccionCompleta, total: calcularTotal() } });
  };

  const handleContinue = async () => {
    if (!userId) return;

    if (selectedAddress) {
      try {
        const { valido, errores } = await validateCartStock(userId);

        if (!valido && errores?.length > 0) {
          const primerError = errores[0];
          toast.error(`Stock insuficiente para ${primerError.nombre}. Disponible: ${primerError.stockDisponible}`);
          return;
        }

        const direccionCompleta = {
          ...selectedAddress,
          telefono: selectedAddress.telefonoContacto,
        };

        navigateToPayment(direccionCompleta);

      } catch (error) {
        console.error('Error validando stock:', error);
        toast.error(error.message || 'Error al validar el carrito');
      }

    } else if (isAddingAddress) {
      handleSelectNewAddressAndContinue();
    }
  };

  const handleSelectNewAddressAndContinue = async () => {
    if (!isAddingAddress) return;
    const campos = ['ciudad', 'codigoPostal', 'calle', 'numeroCasa', 'telefono'];
    const newErrors = {};

    campos.forEach((campo) => {
      const err = validar(campo, newAddress[campo]);
      if (err) newErrors[campo] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { valido, errores } = await validateCartStock(userId);

      if (!valido && errores?.length > 0) {
        const primerError = errores[0];
        toast.error(`Stock insuficiente para ${primerError.nombre}. Disponible: ${primerError.stockDisponible}`);
        return;
      }

      const direccionCompleta = { ...newAddress };
      navigateToPayment(direccionCompleta);

    } catch (error) {
      console.error('Error validando stock:', error);
      toast.error(error.message || 'Error al validar el carrito');
    }
  };

  const canContinue = () => {
    if (selectedAddress) {
      return !!selectedAddress.telefonoContacto;
    }

    if (isAddingAddress) {
      const campos = ['ciudad', 'codigoPostal', 'calle', 'numeroCasa', 'telefono'];
      return campos.every((c) => validar(c, newAddress[c]) === '');
    }
    
    return false;
  };

  return (
    <>
      <div className="shipping-page">
        <CartHeader pasoActual={2} />

        <div className="shipping-container">
          <div className="shipping-content">

            <div className="shipping-form-panel">
              <h2>Dirección de envío</h2>

              {addressesLoading ? (
                <p className="no-addresses-msg">Cargando direcciones...</p>
              ) : addresses.length === 0 && !isAddingAddress ? (
                <p className="no-addresses-msg">No tienes direcciones guardadas.</p>
              ) : (
                addresses.map((addr) => (
                  <div
                    className={`shipping-address-item ${selectedAddress?.id === addr.id ? 'selected' : ''}`}
                    key={addr.id}
                  >
                    <div
                      className="shipping-address-info"
                      onClick={() => setSelectedAddress(addr)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setSelectedAddress(addr);
                      }}
                    >
                      <p className="shipping-address-line">
                        {addr.calle}, {addr.numeroCasa}
                      </p>
                      <p className="shipping-address-line">
                        {addr.codigoPostal} {addr.ciudad}
                      </p>
                      <p className="shipping-address-line shipping-address-meta">
                        {addr.region === 'canarias' ? 'Islas Canarias' : 'Península y Baleares'}
                        {addr.telefonoContacto && ` • +34 ${addr.telefonoContacto}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-delete-address"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr.id);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}

              {isAddingAddress && (
                <div className="add-address-form">
                  <h3>Nueva dirección</h3>

                  <div className="form-row-shipping">
                    <div className="form-group-shipping">
                      <label htmlFor="new-region">Región</label>
                      <select
                        id="new-region"
                        name="region"
                        value={newAddress.region}
                        onChange={handleNewAddressChange}
                      >
                        <option value="peninsula">Península y Baleares</option>
                        <option value="canarias">Islas Canarias</option>
                      </select>
                    </div>
                    <div className="form-group-shipping">
                      <label htmlFor="new-ciudad">Ciudad</label>
                      <input
                        type="text"
                        id="new-ciudad"
                        name="ciudad"
                        value={newAddress.ciudad}
                        onChange={handleNewAddressChange}
                        placeholder="Madrid"
                        className={errors.ciudad ? 'input-error' : ''}
                      />
                      {errors.ciudad && <span className="field-error">{errors.ciudad}</span>}
                    </div>
                  </div>

                  <div className="form-row-shipping">
                    <div className="form-group-shipping">
                      <label htmlFor="new-codigoPostal">Código postal</label>
                      <input
                        type="text"
                        id="new-codigoPostal"
                        name="codigoPostal"
                        value={newAddress.codigoPostal}
                        onChange={handleNewAddressChange}
                        placeholder="28001"
                        maxLength={5}
                        className={errors.codigoPostal ? 'input-error' : ''}
                      />
                      {errors.codigoPostal && <span className="field-error">{errors.codigoPostal}</span>}
                    </div>
                    <div className="form-group-shipping">
                      <label htmlFor="new-telefono">Nº de contacto</label>
                      <div className="input-prefix-wrapper">
                        <span className="input-prefix">+34</span>
                        <input
                          type="tel"
                          id="new-telefono"
                          name="telefono"
                          value={newAddress.telefono}
                          onChange={handleNewAddressChange}
                          placeholder="600123456"
                          maxLength={9}
                          className={errors.telefono ? 'input-error' : ''}
                        />
                      </div>
                      {errors.telefono && <span className="field-error">{errors.telefono}</span>}
                    </div>
                  </div>

                  <div className="form-row-shipping">
                    <div className="form-group-shipping">
                      <label htmlFor="new-calle">Calle</label>
                      <input
                        type="text"
                        id="new-calle"
                        name="calle"
                        value={newAddress.calle}
                        onChange={handleNewAddressChange}
                        placeholder="Calle Gran Vía"
                        className={errors.calle ? 'input-error' : ''}
                      />
                      {errors.calle && <span className="field-error">{errors.calle}</span>}
                    </div>
                    <div className="form-group-shipping short">
                      <label htmlFor="new-numeroCasa">Número</label>
                      <input
                        type="text"
                        id="new-numeroCasa"
                        name="numeroCasa"
                        value={newAddress.numeroCasa}
                        onChange={handleNewAddressChange}
                        placeholder="12B"
                        className={errors.numeroCasa ? 'input-error' : ''}
                      />
                      {errors.numeroCasa && <span className="field-error">{errors.numeroCasa}</span>}
                    </div>
                  </div>

                  <div className="add-address-actions">
                    <button type="button" className="btn-save-address" onClick={handleAddAddress}>
                      Guardar dirección
                    </button>
                    <button
                      type="button"
                      className="btn-continue-new-address"
                      onClick={handleSelectNewAddressAndContinue}
                    >
                      Usar y continuar al pago
                    </button>
                    <button
                      type="button"
                      className="btn-cancel-address"
                      onClick={() => {
                        setIsAddingAddress(false);
                        setNewAddress({
                          region: 'peninsula',
                          ciudad: '',
                          codigoPostal: '',
                          calle: '',
                          numeroCasa: '',
                          telefono: '',
                        });
                        setErrors({});
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {!isAddingAddress && (
                <button
                  type="button"
                  className="btn-add-address"
                  onClick={() => setIsAddingAddress(true)}
                >
                  + Añadir dirección
                </button>
              )}

            </div>

            <div className="shipping-summary">
              <h2>Resumen</h2>
              <div className="summary-content-shipping">
                <div className="summary-detail-shipping">
                  <h3>Total productos</h3>
                  {cartLoading ? (
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>Cargando...</p>
                  ) : (
                    <>
                      {productosCarrito.map((p) => (
                        <div className="summary-line-shipping" key={p.id}>
                          <span>{p.nombre} x{p.cantidad}</span>
                          <span>{(p.precio * p.cantidad).toFixed(2)}€</span>
                        </div>
                      ))}
                      <div className="summary-line-shipping">
                        <span>Gastos de envío</span>
                        <span>Gratis</span>
                      </div>
                      <div className="summary-total-shipping">
                        <div className="final-price-shipping">
                          <span>Precio final</span>
                          <span>{calcularTotal()}€</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-continue-shipping"
                  onClick={handleContinue}
                  disabled={!canContinue()}
                  title={!canContinue() ? 'Selecciona una dirección o añade una nueva' : ''}
                >
                  Continuar al pago
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Shipping;
