import { Link, useNavigate } from "react-router-dom";
import ClientesForm from "../components/ClientesForm";
import { useClienteForm } from "../hooks/useClienteForm";

function ClientesCreatePage() {
  const navigate = useNavigate();
  const { form, loading, saving, error, success, onChange, submit } = useClienteForm({
    id: undefined,
    isEdit: false
  });

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      setTimeout(() => {
        navigate("/clientes");
      }, 600);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Clientes - Crear</h2>
        <Link className="secondary-btn" to="/clientes">
          Volver al listado
        </Link>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {!loading ? (
        <ClientesForm
          values={form}
          onChange={onChange}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Crear"
        />
      ) : null}
    </section>
  );
}

export default ClientesCreatePage;
