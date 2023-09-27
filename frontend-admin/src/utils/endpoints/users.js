const { defaults } = require('./defaults');

export const users = {
  getAllUser: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/user',
    },
  },
  getSingleUser: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/user/:id',
    },
  },
  deductCoins: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/wallet/deductCoins/:id',
    },
  },
  suspendUser: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/user/suspend',
    },
  },
  sendWarning: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/notifications/user/:id/warning',
    },
  },
  sendSpankee: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/notifications/user/:id/spankee',
    },
  },

  getSingleUserWarning: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/notifications/user/warning',
    },
  },
  getSingleUserSpankee: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/notifications/user/spankee',
    },
  },
};
