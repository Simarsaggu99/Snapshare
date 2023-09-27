const { defaults } = require('./defaults');

export const bounty = {
  createBounty: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/bounty/create ',
    },
  },
  getBounty: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/bounty',
    },
  },
  bountyUserList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/bounty/:id',
    },
  },
  getExpireBounty: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/bounty',
    },
  },
  downloadBounty: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/bounty/:id/download',
    },
  },
};
