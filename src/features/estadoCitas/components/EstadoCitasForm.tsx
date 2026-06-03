function EstadoCitasForm({ values, onChange, onSubmit, saving, submitLabel }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="form-grid"
    >
      <label className="form-field">
        <span>Nombre estado</span>
        <input type="text" name="NombreEstado" value={values.NombreEstado ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Codigo</span>
        <input type="text" name="Codigo" value={values.Codigo ?? ""} onChange={onChange} />
      </label>

      <button type="submit" className="primary-btn" disabled={saving}>
        {saving ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

export default EstadoCitasForm;
