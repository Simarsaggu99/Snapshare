const { defaults } = require('./defaults');

export const Membership = {
    getMembership: {
        v1: {
            ...defaults.methods.GET,
            ...defaults.versions.v1,
            uri: '/memberShipPlans'
        }
    },
    getSingleMemberShipPlan: {
        v1: {
            ...defaults.methods.GET,
            ...defaults.versions.v1,
            uri: '/memberShipPlans/:id'
        }
    },
    addMembershipPlan: {
        v1: {
            ...defaults.methods.GET,
            ...defaults.versions.v1,
            uri: '/memberShipPlans/add'
        }
    },
    updateMemberShipPlans: {
        v1: {
            ...defaults.methods.PUT,
            ...defaults.versions.v1,
            uri: '/memberShipPlans/:id'
        }
    },

}

