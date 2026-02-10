import "./Loading.css";

function Loading() {
  return (
    <div className="loading-pantalla" role="status" aria-label="Cargando contenido">
      <div className="loading-animacion" aria-hidden="true"></div>
      <p>CARGANDO...</p>
    </div>
  );
}

export default Loading;