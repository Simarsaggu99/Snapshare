const { defaults } = require('./defaults');

export const serviceUser = {
  registerServiceUser: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/service-user/register',
    },
  },
  serviceUserList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/service-user',
    },
  },
  getServiceUser: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/service-user/:id',
    },
  },
  editServiceUser: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/service-user/:id',
    },
  },
};
