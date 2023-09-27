const defaults = {
  methods: {
    GET: {
      method: 'GET',
    },
    POST: {
      method: 'POST',
    },
    PUT: {
      method: 'PUT',
    },
    DELETE: {
      method: 'DELETE',
    },
  },
  versions: {
    v1: {
      version: '/api',
    },
  },
};

const apiEndPoints = {
  user: {
    checkUniqueness: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/unique/:email',
      },
    },
    offlineSubscription: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/offlinesubscription',
      },
    },
    forgotPassword: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/forgotPassword',
      },
    },
    verifyOtp: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/verifyOtp/:token',
      },
    },
    resetPassword: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/resetPassword/:token',
      },
    },
    addPartner: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/invite',
      },
    },
    addLicense: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/subscription/license',
      },
    },
    fetchCurrent: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/auth/admin/me',
      },
    },
    updateCurrent: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/me',
      },
    },
    uploadAvatar: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/profileImage',
        headerProps: {
          'Content-Type': 'multipart/form-data',
        },
      },
    },
    updateProfile: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/user/update',
      },
    },
    updateUserProfilePassword: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/user/updatepassword',
      },
    },

    updatePassword: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/verification',
      },
    },
    checkExistingUser: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/user/isExistingLoginId',
      },
    },
    addSubscription: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/subscription',
      },
    },
  },
  common: {
    getStateCodes: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/common/country/:countryId/provinces',
      },
    },
  },
  events: {},

  staff: {
    createStaff: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/invite',
      },
    },
    createEmployee: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/register',
      },
    },
    inviteUser: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/verification',
      },
    },
    addClassToStaff: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/teachers/:staffId/class/association',
      },
    },
    deleteClassOfStaff: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/teachers/:staffId/class/association',
      },
    },
    getStaffList: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/user/list',
      },
    },
    getStaffMember: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/user/:id',
      },
    },
    getStaffDetails: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/teachers/:staffId',
      },
    },
    updateStaffDetails: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/teachers/:staffId',
      },
    },
    disableStaff: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/user/update',
      },
    },
  },
  contect: {
    getContect: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:type',
      },
    },
  },
  students: {
    getStudents: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:type',
      },
    },
    setApproval: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/students/:studentId/request/approve',
      },
    },
    getStudent: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/students/:studentId',
      },
    },
    updateStudentDetails: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/students/:studentId',
      },
    },
    getStudentTaskNotes: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/students/:studentId/tasks/:taskId/notes',
      },
    },
    getStudentTaskAssignment: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/students/:studentId/tasks/:taskId/contents',
      },
    },
    getStudentTasks: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/students/:studentId/tasks',
      },
    },
    getStudentStats: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/students/:studentId/stats',
      },
    },
  },
  teachers: {
    getTeachers: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/teachers',
      },
    },
    searchTasks: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/tasks/search',
      },
    },
    getTeacherTasks: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/teachers/:teacherId/tasks',
      },
    },
    getTaskNote: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/teachers/:teacherId/tasks/:taskId/notes',
      },
    },
    getTaskAttachment: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/teachers/:teacherId/tasks/:taskId/contents',
      },
    },
  },
  // duggout
  getAllUser: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/auth/data',
    },
  },
  // getBounty: {
  //   v1: {
  //     ...defaults.methods.GET,
  //     ...defaults.versions.v1,
  //     uri: '/bounty'
  //   }
  // }
  createBounty: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/bounty/create ',
    },
  },
};

export default apiEndPoints;
