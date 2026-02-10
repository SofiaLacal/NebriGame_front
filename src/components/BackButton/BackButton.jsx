import { useNavigate } from "react-router-dom";
import "./BackButton.css";

function BackButton({ children }) {
  const navigate = useNavigate();

  return (
    <button 
      className="boton-volver"
      onClick={() => navigate(-1)}
    >
      {children}
    </button>
  );
}

export default BackButton;