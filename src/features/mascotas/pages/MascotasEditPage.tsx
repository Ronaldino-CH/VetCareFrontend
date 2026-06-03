import { Link, useNavigate, useParams } from "react-router-dom";
import MascotasForm from "../components/MascotasForm";
import { useMascotaForm } from "../hooks/useMascotaForm";

function MascotasEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { form, clientes, loading, saving, error, success, onChange, submit } = useMascotaForm({
    id: params.id,
    isEdit: true
  });

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      setTimeout(() => {
        navigate("/mascotas");
      }, 600);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Mascotas - Editar</h2>
        <Link className="secondary-btn" to="/mascotas">
          Volver al listado
        </Link>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {!loading ? (
        <MascotasForm
          values={form}
          clientes={clientes}
          onChange={onChange}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Actualizar"
        />
      ) : null}
    </section>
  );
}

export default MascotasEditPage;
