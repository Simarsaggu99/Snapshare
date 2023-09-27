const { defaults } = require('./defaults');

export const contactUs = {
  getContactUs: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/contact',
    },
  },
};
export const getSingleContactUs = {
  getContactUs: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/contact/:id',
    },
  },
};
