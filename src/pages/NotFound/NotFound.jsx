import { useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound({ code = 404, title = "Page Not Found", message }) {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h2>{code} - {title}</h2>
      <p>{message}</p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
}

export default NotFound;


