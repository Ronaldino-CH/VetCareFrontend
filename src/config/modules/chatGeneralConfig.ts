import { ROLE_IDS } from "../../utils/constants";

export const chatGeneralConfig = {
  key: "chatGeneral",
  title: "Chat General",
  basePath: "/chat-general",
  roleAccess: {
    list: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA],
    create: [],
    edit: [],
    toggle: []
  },
  columns: [],
  listConfig: {
    defaultTake: 50,
    searchFields: []
  },
  formFields: []
};
