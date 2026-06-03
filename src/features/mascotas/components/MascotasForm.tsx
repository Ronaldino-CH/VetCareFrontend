function MascotasForm({ values, clientes, onChange, onSubmit, saving, submitLabel }) {
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

      <label className="form-field">
        <span>Especie</span>
        <input type="text" name="Especie" value={values.Especie ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Raza</span>
        <input type="text" name="Raza" value={values.Raza ?? ""} onChange={onChange} />
      </label>

      <label className="form-field">
        <span>Sexo</span>
        <input type="text" name="Sexo" value={values.Sexo ?? ""} onChange={onChange} />
      </label>

      <label className="form-field">
        <span>Fecha de nacimiento</span>
        <input type="date" name="FechaNacimiento" value={values.FechaNacimiento ?? ""} onChange={onChange} required />
      </label>

      <label className="form-field">
        <span>Peso</span>
        <input type="number" name="Peso" value={values.Peso ?? ""} onChange={onChange} />
      </label>

      <label className="form-field">
        <span>Color</span>
        <input type="text" name="Color" value={values.Color ?? ""} onChange={onChange} />
      </label>

      <label className="form-field">
        <span>Cliente</span>
        <select name="IdCliente" value={values.IdCliente ?? ""} onChange={onChange} required>
          <option value="">Seleccione...</option>
          {clientes.map((cliente) => (
            <option key={`cliente-${cliente.value}`} value={cliente.value}>
              {cliente.label}
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

export default MascotasForm;
