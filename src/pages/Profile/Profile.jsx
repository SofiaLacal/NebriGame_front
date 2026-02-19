import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import useUserStore from '../../stores/userStore';
import { updateProfile, deleteProfile } from '../../api/useAuth';
import Header from '../../components/Header/Header';
import { toast } from '../../stores/toastStore';
import Footer from '../../components/Footer/Footer';
import './Profile.css';

const DELETE_MODALS = [
  { msg: '¿Eliminar tu cuenta? Esta acción no se puede deshacer.', pos: 'top-left' },
  { msg: '¿Estás SEGURO? Todos tus pedidos, wishlist y datos... ¡desaparecerán para siempre!', pos: 'top-right' },
  { msg: 'Los juegos de tu biblioteca te llorarán. Las ranas del carrito también. ¿Continuar?', pos: 'bottom-right' },
  { msg: 'Ya está. Que la fuerza te acompañe... en otra cuenta. Adiós. 👋', pos: 'bottom-left' },
];

function Profile() {
  const navigate = useNavigate();
  const { id, nombre, apellido1, apellido2, email, setUsuario, logout } = useUserStore();

  const [tabActiva, setTabActiva] = useState('info');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoModal, setTipoModal] = useState('');
  const [deleteModalStep, setDeleteModalStep] = useState(0);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [formInfo, setFormInfo] = useState({ nombre, apellido1, apellido2, email });
  const formInfoInitial = { nombre, apellido1, apellido2, email };
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [mensajeInfo, setMensajeInfo] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const [formPass, setFormPass] = useState({ contrasennaActual: '', contrasennaNueva: '', confirmar: '' });
  const [loadingPass, setLoadingPass] = useState(false);
  const [mensajePass, setMensajePass] = useState(null);
  const [errorPass, setErrorPass] = useState(null);

  const handleInfoChange = (e) => setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
  const handlePassChange = (e) => setFormPass({...formPass, [e.target.name]: e.target.value 
    
  });


  const abrirModal = (tipo) => {
    setTipoModal(tipo);
    setModalAbierto(true);
    setMensajeInfo(null);
    setErrorInfo(null);
    setMensajePass(null);
    setErrorPass(null);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTipoModal('');
  };

  const abrirModalEliminar = () => setDeleteModalStep(1);
  const cerrarModalEliminar = () => setDeleteModalStep(0);
  const confirmarEliminar = () => {
    if (deleteModalStep < 4) {
      setDeleteModalStep((s) => s + 1);

    } else {
      ejecutarEliminacion();
    }
  };

  const ejecutarEliminacion = async () => {
    const userId = id != null && !isNaN(Number(id)) ? Number(id) : null;
    if (!userId) {
      toast.error('No se pudo identificar tu cuenta. Intenta cerrar sesión y volver a iniciar.');
      setDeleteModalStep(0);
      return;
    }

    setDeletingAccount(true);

    try {
      await deleteProfile(userId);
      logout();
      toast.success('Cuenta eliminada');
      navigate('/', { replace: true });

    } catch (err) {
      toast.error(err.message || 'Error al eliminar la cuenta');
      setDeleteModalStep(0);
      
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleGuardarInfo = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);
    setMensajeInfo(null);
    setErrorInfo(null);

    try {
      if (formInfo.nombre === formInfoInitial.nombre && formInfo.apellido1 === formInfoInitial.apellido1 &&
        formInfo.apellido2 === formInfoInitial.apellido2 && formInfo.email === formInfoInitial.email) {
       setErrorInfo('No hay cambios para guardar');  

        } else if (formInfo.nombre === '') {
          setErrorInfo('El nombre no puede estar vacío');

        } else if (formInfo.apellido1 === '') {
          setErrorInfo('El primer apellido no puede estar vacío');

        } else if (formInfo.email === '') {
          setErrorInfo('El email no puede estar vacío');

          } else {
            await updateProfile(id, {
              nombre: formInfo.nombre,
              apellido1: formInfo.apellido1,
              apellido2: formInfo.apellido2,
              email: formInfo.email,
      });

        setUsuario(id, formInfo.nombre, formInfo.apellido1, formInfo.apellido2, formInfo.email);
        setMensajeInfo('Datos actualizados correctamente');
        setTimeout(() => cerrarModal(), 1500);
      }

    } catch (err) {
      setErrorInfo(err.message || 'Error al actualizar los datos');

    } finally {
        setLoadingInfo(false);
      }
  };

  const handleGuardarPass = async (e) => {
    e.preventDefault();
    setMensajePass(null);
    setErrorPass(null);

    if (formPass.contrasennaNueva !== formPass.confirmar) {
      setErrorPass('Las contraseñas nuevas no coinciden');
      return;

    } else if (formPass.contrasennaNueva === '') {
      setErrorPass('La contraseña nueva no puede estar vacía');
      return;

    } else if (formPass.contrasennaActual === '') {
      setErrorPass('La contraseña actual no puede estar vacía');
      return;

    } else if (formPass.contrasennaNueva === formPass.contrasennaActual) {
      setErrorPass('La contraseña nueva no puede ser igual a la actual');
      return;
    }
    setLoadingPass(true);

    try {
      await updateProfile(id, {
        contrasenna: formPass.contrasennaNueva,
        contrasennaActual: formPass.contrasennaActual,
      });

      setMensajePass('Contraseña actualizada correctamente');
      setFormPass({ contrasennaActual: '', contrasennaNueva: '', confirmar: '' });
      setTimeout(() => cerrarModal(), 1500);

    } catch (err) {
      setErrorPass(err.message || 'Error al actualizar la contraseña');
      
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <>
      <div className="background-profile">
        <Header />
        <div className="perfil-container">

          <div className="perfil-tabs">
            <button className={`perfil-tab ${tabActiva === 'info' ? 'activa' : ''}`} onClick={() => setTabActiva('info')}>
              Mi cuenta
            </button>
            <button className={`perfil-tab ${tabActiva === 'ajustes' ? 'activa' : ''}`} onClick={() => setTabActiva('ajustes')}>
              Ajustes
            </button>
          </div>

          <div className="perfil-contenido">
            {tabActiva === 'info' && (
              <>
                <div className="perfil-seccion">
                  <div className="perfil-seccion-header">
                    <h2>Datos personales</h2>
                    <button className="perfil-btn-editar" onClick={() => abrirModal('info')}>
                      Editar
                    </button>
                  </div>
                  <div className="perfil-detalles">
                    <div className="perfil-detalle">
                      <span className="perfil-label">Nombre</span>
                      <span className="perfil-valor">{nombre || '-'}</span>
                    </div>
                    <div className="perfil-detalle">
                      <span className="perfil-label">Primer apellido</span>
                      <span className="perfil-valor">{apellido1 || '-'}</span>
                    </div>
                    <div className="perfil-detalle">
                      <span className="perfil-label">Segundo apellido</span>
                      <span className="perfil-valor">{apellido2 || '-'}</span>
                    </div>
                    <div className="perfil-detalle">
                      <span className="perfil-label">Email</span>
                      <span className="perfil-valor">{email || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="perfil-seccion">
                  <div className="perfil-seccion-header">
                    <h2>Contraseña</h2>
                    <button className="perfil-btn-editar" onClick={() => abrirModal('password')}>
                      Cambiar
                    </button>
                  </div>
                  <div className="perfil-detalles">
                    <div className="perfil-detalle">
                      <span className="perfil-label">Contraseña</span>
                      <span className="perfil-valor">••••••••</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {tabActiva === 'ajustes' && (
              <div className="perfil-seccion">
                <h2>Ajustes de la cuenta</h2>
                
                <div className="ajustes-grupo">
                  <div className="ajuste-item">
                    <div className="ajuste-info">
                      <h3>Notificaciones por email</h3>
                      <p>Recibe actualizaciones sobre tus pedidos y ofertas</p>
                    </div>
                    <label className="ajuste-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="ajuste-slider"></span>
                    </label>
                  </div>

                  <div className="ajuste-item">
                    <div className="ajuste-info">
                      <h3>Newsletter</h3>
                      <p>Mantente al día con las últimas novedades</p>
                    </div>
                    <label className="ajuste-switch">
                      <input type="checkbox" />
                      <span className="ajuste-slider"></span>
                    </label>
                  </div>

                  <div className="ajuste-item">
                    <div className="ajuste-info">
                      <h3>Notificaciones de ofertas</h3>
                      <p>Recibe alertas de descuentos y promociones</p>
                    </div>
                    <label className="ajuste-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="ajuste-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="ajustes-separador"></div>

                <div className="ajustes-subgrupo">
                  <h3 className="ajustes-subtitulo">Zona de peligro</h3>
                    <button className="perfil-btn-peligro" onClick={abrirModalEliminar}>
                      Eliminar mi cuenta
                    </button>
                    <p className="ajustes-advertencia">
                      Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.
                    </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {deleteModalStep > 0 && (
          <div className="modal-overlay modal-delete-overlay" onClick={cerrarModalEliminar}>
            <div
              className={`modal-delete modal-delete--${DELETE_MODALS[deleteModalStep - 1].pos}`}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="modal-delete-msg">{DELETE_MODALS[deleteModalStep - 1].msg}</p>
              <div className="modal-delete-actions">
                <button className="modal-delete-btn modal-delete-btn--cancel" onClick={cerrarModalEliminar}>
                  No, mejor no
                </button>
                <button
                  className="modal-delete-btn modal-delete-btn--confirm"
                  onClick={confirmarEliminar}
                  disabled={deletingAccount}
                >
                  {deletingAccount ? 'Eliminando...' : deleteModalStep === 4 ? 'Sí, eliminar' : 'Sí, continuar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {modalAbierto && (
          <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{tipoModal === 'info' ? 'Editar datos personales' : 'Cambiar contraseña'}</h2>
                <button className="modal-cerrar" onClick={cerrarModal}>
                  <X size={24} />
                </button>
              </div>

              {tipoModal === 'info' && (
                <form onSubmit={handleGuardarInfo} className="perfil-form">
                  <div className="perfil-campo">
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={formInfo.nombre || ''} onChange={handleInfoChange} />
                  </div>
                  <div className="perfil-campo">
                    <label>Primer apellido</label>
                    <input type="text" name="apellido1" value={formInfo.apellido1 || ''} onChange={handleInfoChange} />
                  </div>
                  <div className="perfil-campo">
                    <label>Segundo apellido</label>
                    <input type="text" name="apellido2" value={formInfo.apellido2 || ''} onChange={handleInfoChange} />
                  </div>
                  <div className="perfil-campo">
                    <label>Email</label>
                    <input type="email" name="email" value={formInfo.email || ''} onChange={handleInfoChange} />
                  </div>
                  {mensajeInfo && <p className="perfil-exito">{mensajeInfo}</p>}
                  {errorInfo && <p className="perfil-error">{errorInfo}</p>}
                  <button type="submit" className="perfil-btn" disabled={loadingInfo}>
                    {loadingInfo ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </form>
              )}

              {tipoModal === 'password' && (
                <form onSubmit={handleGuardarPass} className="perfil-form">
                  <div className="perfil-campo">
                    <label>Contraseña actual</label>
                    <input type="password" name="contrasennaActual" value={formPass.contrasennaActual} onChange={handlePassChange} placeholder="Escribe tu contraseña actual" />
                  </div>
                  <div className="perfil-campo">
                    <label>Nueva contraseña</label>
                    <input type="password" name="contrasennaNueva" value={formPass.contrasennaNueva} onChange={handlePassChange} placeholder="Escribe tu nueva contraseña" />
                  </div>
                  <div className="perfil-campo">
                    <label>Confirmar nueva contraseña</label>
                    <input type="password" name="confirmar" value={formPass.confirmar} onChange={handlePassChange} placeholder="Repite la nueva contraseña" />
                  </div>
                  {mensajePass && <p className="perfil-exito">{mensajePass}</p>}
                  {errorPass && <p className="perfil-error">{errorPass}</p>}
                  <button type="submit" className="perfil-btn" disabled={loadingPass}>
                    {loadingPass ? 'Guardando...' : 'Cambiar contraseña'}
                  </button>
                </form>
              )}

            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Profile;