const { defaults } = require('./defaults');

export const reported = {
  getAllReportedPost: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/post/all/reported',
    },
  },
  restorePost: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/post/restore/reported/:id',
    },
  },
  deleteReportedPost: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/post/del/:id',
    },
  },
  singleRestorePost: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/post/reportedPost/:id',
    },
  },
};
