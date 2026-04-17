import httpClient from "../api/httpClient";

export function createCrudService(resourcePath, options = {}) {
  const hasActivos = Boolean(options.hasActivos);
  const hasToggle = Boolean(options.hasToggle);
  const hasPaginado = options.hasPaginado !== false;

  return {
    async findAll() {
      const { data } = await httpClient.get(resourcePath);
      return data;
    },
    async findById(id) {
      const { data } = await httpClient.get(`${resourcePath}/${id}`);
      return data;
    },
    async create(payload) {
      const { data } = await httpClient.post(resourcePath, payload);
      return data;
    },
    async update(id, payload) {
      const { data } = await httpClient.put(`${resourcePath}/${id}`, payload);
      return data;
    },
    async getActivos() {
      if (!hasActivos) return [];
      const { data } = await httpClient.get(`${resourcePath}/activos`);
      return data;
    },
    async toggleStatus(id) {
      if (!hasToggle) return null;
      const { data } = await httpClient.delete(`${resourcePath}/${id}`);
      return data;
    },
    async searchPaginated(params = {}) {
      if (!hasPaginado) return null;
      const query = new URLSearchParams();

      if (params.Page !== undefined && params.Page !== null) query.append("Page", String(params.Page));
      if (params.Take !== undefined && params.Take !== null) query.append("Take", String(params.Take));
      if (params.Sort) query.append("Sort", String(params.Sort));

      if (Array.isArray(params.Filters)) {
        params.Filters.forEach((filter) => {
          if (filter) query.append("Filters", String(filter));
        });
      }

      const queryString = query.toString();
      const url = queryString ? `${resourcePath}/BusquedaPaginado?${queryString}` : `${resourcePath}/BusquedaPaginado`;
      const { data } = await httpClient.get(url);
      return data;
    }
  };
}
