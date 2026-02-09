import { useNavigate } from "react-router-dom";

function BackButton({ texto = "Volver", className = "" }) {
  const navigate = useNavigate();

  return (
    <button 
      className={className}
      onClick={() => navigate(-1)}
    >
      {texto}
    </button>
  );
}

export default BackButton;