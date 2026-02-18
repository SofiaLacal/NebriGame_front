import { useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound({ code = 404, title = "Page Not Found", message }) {
  const navigate = useNavigate();

  return (
      <div className="not-found-background">
        <div className="not-found-container">
          <div className="not-found-content">
            <h2>{code} - {title}</h2>
            <p className="tipo-unown">ABCDEFGHIJKLMNÑOPQRSTUVWYZ</p>
            <p>{message}</p>

            <button onClick={() => navigate("/")}>Home</button>

            {/* Sección de pruebas de errores */}
            {/*<div>
                <h3>Testing de errores:</h3>
                <div className="test-buttons">
                  <button onClick={() => navigate('/error-403')}>Test Error 403</button>
                  <button onClick={() => navigate('/error-500')}>Test Error 500</button>
                  <button onClick={() => navigate('/pagina-que-no-existe')}>Test Error 404</button>
                </div>
              </div> */}
          </div>
        </div>
      </div>
  );
}

export default NotFound;
