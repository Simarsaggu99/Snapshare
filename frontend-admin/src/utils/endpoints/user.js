const { defaults } = require('./defaults');

export const user = {
  loginUser: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: 'auth/admin/login',
    },
  },
  getAllUser: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/user',
    },
  },
};
