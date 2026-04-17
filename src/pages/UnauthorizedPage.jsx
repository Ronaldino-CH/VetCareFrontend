import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <section className="page">
      <h2>Sin acceso</h2>
      <p>No tienes permisos para ingresar a esta pantalla.</p>
      <Link to="/" className="primary-btn">
        Volver al inicio
      </Link>
    </section>
  );
}

export default UnauthorizedPage;
