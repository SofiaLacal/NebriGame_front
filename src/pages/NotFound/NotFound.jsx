import { useNavigate } from "react-router-dom";
import "./NotFound.css";
import Header from "../../components/Header/Header";

function NotFound({ code = 404, title = "Page Not Found", message }) {
  const navigate = useNavigate();

  return (
    <>
      <Header/>

      <div className="not-found">
        <h2>{code} - {title}</h2>
        <p className="tipo-unown">ABCDEFGHIJKLMNÑOPQRSTUVWYZ</p>
        <p>{message}</p>
        <button onClick={() => navigate("/")}>Home</button>
      </div>
    </>
  );
}

export default NotFound;
