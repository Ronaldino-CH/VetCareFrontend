import { Link, useNavigate } from "react-router-dom";
import CitasForm from "../components/CitasForm";
import { useCitaForm } from "../hooks/useCitaForm";

function CitasCreatePage() {
  const navigate = useNavigate();
  const { form, mascotas, veterinarios, estadoCitas, loading, saving, error, success, onChange, submit } = useCitaForm({
    id: undefined,
    isEdit: false
  });

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      setTimeout(() => {
        navigate("/citas");
      }, 600);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Citas - Crear</h2>
        <Link className="secondary-btn" to="/citas">
          Volver al listado
        </Link>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {!loading ? (
        <CitasForm
          values={form}
          mascotas={mascotas}
          veterinarios={veterinarios}
          estadoCitas={estadoCitas}
          onChange={onChange}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Crear"
        />
      ) : null}
    </section>
  );
}

export default CitasCreatePage;
