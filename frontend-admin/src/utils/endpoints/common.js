const { defaults } = require('./defaults');

export const common = {
  productTypes: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/types',
    },
  },
  createProductType: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products/types',
    },
  },
  updateProductType: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/products/types/:typeId',
    },
  },
  uploadContent: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/content',
      headerProps: {
        'Content-Type': 'multipart/form-data',
      },
    },
  },
  generatePayment: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/stripe/generate',
    },
  },
  confirmPayment: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/stripe/confirm',
    },
  },
  dashboardStats: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/dashboard/stats/all',
    },
  },
};
