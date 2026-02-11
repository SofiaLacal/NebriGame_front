import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../api/useCart';
import SimpleHeader from '../../components/SimpleHeader/SimpleHeader';
import Footer from '../../components/Footer/Footer';
import useUserStore from '../../stores/userStore';
import './Shipping.css';

function Shipping() {
  const navigate = useNavigate();
  const userId = useUserStore.getState().id;
  const { cart, loading: cartLoading } = useCart(userId);

  const [productosCarrito, setProductosCarrito] = useState([]);
  const [formData, setFormData] = useState({
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

  // Reglas de validación por campo
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
        return /^\+[0-9]{1,3}\s?[0-9]{6,12}$/.test(value)
          ? ''
          : 'Solo números, entre 9 y 15 dígitos';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validar(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos antes de navegar
    const camposAValidar = ['ciudad', 'codigoPostal', 'calle', 'numeroCasa', 'telefono'];
    const newErrors = {};
    camposAValidar.forEach((campo) => {
      const error = validar(campo, formData[campo]);
      if (error) newErrors[campo] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigate('/pago', { state: { direccion: formData, total: calcularTotal() } });
  };

  return (
    <>
      <div className="shipping-page">
        <SimpleHeader />

        <div className="shipping-container">
          <div className="shipping-content">

            {/* ── Formulario (izquierda) ── */}
            <div className="shipping-form-panel">
              <h2>Dirección de envío</h2>

              <form id="shipping-form" className="shipping-form" onSubmit={handleSubmit}>

                {/* Fila 1: Región + Ciudad */}
                <div className="form-row-shipping">
                  <div className="form-group-shipping">
                    <label htmlFor="region">Región</label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      required
                    >
                      <option value="peninsula">Península y Baleares</option>
                      <option value="canarias">Islas Canarias</option>
                    </select>
                  </div>
                  <div className="form-group-shipping">
                    <label htmlFor="ciudad">Ciudad</label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      placeholder="Madrid"
                      className={errors.ciudad ? 'input-error' : ''}
                      required
                    />
                    {errors.ciudad && <span className="field-error">{errors.ciudad}</span>}
                  </div>
                </div>

                {/* Fila 2: Código postal + Nº de contacto */}
                <div className="form-row-shipping">
                  <div className="form-group-shipping">
                    <label htmlFor="codigoPostal">Código postal</label>
                    <input
                      type="text"
                      id="codigoPostal"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      placeholder="28001"
                      maxLength={5}
                      className={errors.codigoPostal ? 'input-error' : ''}
                      required
                    />
                    {errors.codigoPostal && <span className="field-error">{errors.codigoPostal}</span>}
                  </div>
                  <div className="form-group-shipping">
                    <label htmlFor="telefono">Nº de contacto</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+34 600 123 456"
                      className={errors.telefono ? 'input-error' : ''}
                      required
                    />
                    {errors.telefono && <span className="field-error">{errors.telefono}</span>}
                  </div>
                </div>

                {/* Fila 3: Calle + Número */}
                <div className="form-row-shipping">
                  <div className="form-group-shipping">
                    <label htmlFor="calle">Calle</label>
                    <input
                      type="text"
                      id="calle"
                      name="calle"
                      value={formData.calle}
                      onChange={handleChange}
                      placeholder="Calle Gran Vía"
                      className={errors.calle ? 'input-error' : ''}
                      required
                    />
                    {errors.calle && <span className="field-error">{errors.calle}</span>}
                  </div>
                  <div className="form-group-shipping short">
                    <label htmlFor="numeroCasa">Número</label>
                    <input
                      type="text"
                      id="numeroCasa"
                      name="numeroCasa"
                      value={formData.numeroCasa}
                      onChange={handleChange}
                      placeholder="12B"
                      className={errors.numeroCasa ? 'input-error' : ''}
                      required
                    />
                    {errors.numeroCasa && <span className="field-error">{errors.numeroCasa}</span>}
                  </div>
                </div>

              </form>
            </div>

            {/* Resumen (derecha) */}
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
                <button type="submit" form="shipping-form" className="btn-continue-shipping">
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