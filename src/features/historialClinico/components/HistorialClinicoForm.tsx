function HistorialClinicoForm({ values, mascotas, veterinarios, onChange, onSubmit, saving, submitLabel }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="form-grid"
    >
      <label className="form-field">
        <span>Mascota</span>
        <select name="IdMascota" value={values.IdMascota ?? ""} onChange={onChange} required>
          <option value="">Seleccione...</option>
          {mascotas.map((mascota) => (
            <option key={`mascota-${mascota.value}`} value={mascota.value}>
              {mascota.label}
            </option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span>Diagnostico</span>
        <input type="text" name="Diagnostico" value={values.Diagnostico ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Tratamiento</span>
        <input type="text" name="Tratamiento" value={values.Tratamiento ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Observaciones</span>
        <input type="text" name="Observaciones" value={values.Observaciones ?? ""} onChange={onChange} />
      </label>

      <label className="form-field">
        <span>Veterinario</span>
        <select name="IdVeterinario" value={values.IdVeterinario ?? ""} onChange={onChange} required>
          <option value="">Seleccione...</option>
          {veterinarios.map((veterinario) => (
            <option key={`veterinario-${veterinario.value}`} value={veterinario.value}>
              {veterinario.label}
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

export default HistorialClinicoForm;
