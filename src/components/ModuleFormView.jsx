import { Link, useNavigate, useParams } from "react-router-dom";
import { modulesConfig } from "../models/modulesConfig";
import { moduleServices } from "../services";
import { useModuleForm } from "../hooks/useModuleForm";
import { useRelationsData } from "../hooks/useRelationsData";
import ModuleForm from "./ModuleForm";

function ModuleFormView({ moduleKey, mode }) {
  const navigate = useNavigate();
  const params = useParams();
  const config = modulesConfig[moduleKey];
  const service = moduleServices[moduleKey];
  const relationOptions = useRelationsData(config);
  const isEdit = mode === "edit";
  const id = params.id;

  const { form, loading, saving, error, success, onChange, submit } = useModuleForm({
    service,
    formFields: config.formFields,
    id,
    isEdit
  });

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      setTimeout(() => {
        navigate(config.basePath);
      }, 600);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>
          {config.title} - {isEdit ? "Editar" : "Crear"}
        </h2>
        <Link className="secondary-btn" to={config.basePath}>
          Volver al listado
        </Link>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {!loading ? (
        <ModuleForm
          fields={config.formFields}
          values={form}
          onChange={onChange}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel={isEdit ? "Actualizar" : "Crear"}
          relationOptions={relationOptions}
        />
      ) : null}
    </section>
  );
}

export default ModuleFormView;
