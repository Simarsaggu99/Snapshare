const { defaults } = require('./defaults');

export const order = {
  orderList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/order/list',
    },
  },
  getorder: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/order/:id',
    },
  },
};
