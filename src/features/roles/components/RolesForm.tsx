function RolesForm({ values, onChange, onSubmit, saving, submitLabel }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="form-grid"
    >
      <label className="form-field">
        <span>Nombre</span>
        <input type="text" name="Nombre" value={values.Nombre ?? ""} onChange={onChange} required />
      </label>

      <button type="submit" className="primary-btn" disabled={saving}>
        {saving ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

export default RolesForm;
