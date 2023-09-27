const { defaults } = require('./defaults');

export const leads = {
  getLeadsList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/lead/list',
    },
  },
  exportLeads: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/lead/export",
    },
  },
};
