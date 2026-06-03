function ClientesForm({ values, onChange, onSubmit, saving, submitLabel }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="form-grid"
    >
      <label className="form-field">
        <span>Nombres</span>
        <input type="text" name="Nombres" value={values.Nombres ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Apellidos</span>
        <input type="text" name="Apellidos" value={values.Apellidos ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Documento</span>
        <input type="text" name="Documento" value={values.Documento ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Telefono</span>
        <input type="text" name="Telefono" value={values.Telefono ?? ""} onChange={onChange} />
      </label>

      <label className="form-field">
        <span>Correo</span>
        <input type="email" name="Correo" value={values.Correo ?? ""} onChange={onChange} />
      </label>

      <label className="form-field">
        <span>Direccion</span>
        <input type="text" name="Direccion" value={values.Direccion ?? ""} onChange={onChange} />
      </label>

      <button type="submit" className="primary-btn" disabled={saving}>
        {saving ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

export default ClientesForm;
