import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import loginBackground from "../assets/inicio1.jpg";
import vetcareLogo from "../assets/vetcare.png";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      await login({ userName, password });

      const redirectPath = location.state?.from?.pathname || "/";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        "No se pudo iniciar sesión";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page login-scene" style={{ backgroundImage: `url(${loginBackground})` }}>
      <div className="login-panel">
        <div className="login-card">
          <div className="login-left">
            <p className="login-slogan">Cuidamos a quienes forman parte de tu familia</p>
            <div className="login-brand-box">
              <img src={vetcareLogo} alt="VetCare" className="login-brand-logo" />
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>

            <label className="form-field">
              <span>Usuario</span>
              <input type="text" value={userName} onChange={(event) => setUserName(event.target.value)} required />
            </label>

            <label className="form-field">
              <span>Contraseña</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>

            {error ? <p className="error">{error}</p> : null}

            <button className="primary-btn login-submit" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
