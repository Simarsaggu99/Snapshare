const { defaults } = require('./defaults');

export const transactions = {
  getAllTransaction: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/transaction',
    },
  },
  updateTransaction: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/transaction/:id',
    },
  },
};
