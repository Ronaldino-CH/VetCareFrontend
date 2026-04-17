function ModuleForm({ fields, values, onChange, onSubmit, saving, submitLabel, relationOptions }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="form-grid"
    >
      {fields.map((field) => {
        const options = field.relationKey ? relationOptions?.[field.relationKey] || [] : [];

        return (
          <label key={field.name} className="form-field">
            <span>{field.label}</span>

            {field.type === "select" ? (
              <select name={field.name} value={values[field.name] ?? ""} onChange={onChange} required={field.required}>
                <option value="">Seleccione...</option>
                {options.map((option) => (
                  <option key={`${field.name}-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={values[field.name] ?? ""}
                onChange={onChange}
                required={field.required}
              />
            )}
          </label>
        );
      })}
      <button type="submit" className="primary-btn" disabled={saving}>
        {saving ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

export default ModuleForm;
