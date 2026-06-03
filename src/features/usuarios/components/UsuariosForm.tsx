function UsuariosForm({ values, roles, onChange, onSubmit, saving, submitLabel }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="form-grid"
    >
      <label className="form-field">
        <span>Usuario</span>
        <input type="text" name="UserName" value={values.UserName ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Password</span>
        <input type="password" name="PasswordHash" value={values.PasswordHash ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Nombres</span>
        <input type="text" name="Nombres" value={values.Nombres ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Apellidos</span>
        <input type="text" name="Apellidos" value={values.Apellidos ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Rol</span>
        <select name="IdRol" value={values.IdRol ?? ""} onChange={onChange} required>
          <option value="">Seleccione...</option>
          {roles.map((rol) => (
            <option key={`rol-${rol.value}`} value={rol.value}>
              {rol.label}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="primary-btn" disabled={saving}>
        {saving ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

export default UsuariosForm;
