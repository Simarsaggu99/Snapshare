import {
  getMembership,
  addMembershipPlan,
  updateMemberShipPlans,
  getSingleMemberShipPlan,
} from '@/services/membership';

const Model = {
  namespace: 'membership',
  state: {
    //   registeredLists: [],
    //   registrationDetail: null,
    //   eventDetail: null,
    //   deleteVisitor: null,
    //   showGeneratePdf: false,
    //   idCardPdfUrl: '',
    //   eventList: null,
    //   singleEvent: null
    aaa: null,
  },
  effects: {
    // *getEvent(_, { call, put }) {
    //     let apiResponse;
    //     let err;
    //     try {
    //         apiResponse = yield call(getEvent);
    //         yield put({
    //             type: 'setStates',
    //             payload: apiResponse,
    //             key: 'eventList',
    //         });
    //         return apiResponse;
    //     } catch (error) {
    //         return Promise.reject(err);
    //     }
    // },
    // // duggout
    // *deleteEvent({ payload }, { call }) {
    //     // let apiResponse;
    //     // let err;
    //     try {
    //         const apiResponse = yield call(deleteEvent, payload || {});
    //         // yield put({
    //         //   type: 'setStates',
    //         //   payload: apiResponse,
    //         //   key: 'deleteVisitor',
    //         // });
    //         return Promise.resolve(apiResponse);

    //     } catch (error) {
    //         // extract the error response from the server
    //         return Promise.reject(error);
    //     }
    //     // if (err) {
    //     //   // some api level error occurred. This can be handled in dispatch
    //     //   return Promise.reject(err);
    //     // }
    //     // return apiResponse;
    // },
    // *updateEvent({ payload }, { call }) {
    //     // let apiResponse;
    //     // let err;
    //     try {
    //         const apiResponse = yield call(updateEvent, payload || {});
    //         // yield put({
    //         //   type: 'setStates',
    //         //   payload: apiResponse,
    //         //   key: 'deleteVisitor',
    //         // });
    //         return Promise.resolve(apiResponse);

    //     } catch (error) {
    //         // extract the error response from the server
    //         return Promise.reject(error);
    //     }
    //     // if (err) {
    //     //   // some api level error occurred. This can be handled in dispatch
    //     //   return Promise.reject(err);
    //     // }
    //     // return apiResponse;
    // },
    // *getSingleEvent({ payload }, { call, put }) {
    //     // let apiResponse;
    //     // let err;
    //     try {
    //         const apiResponse = yield call(getSingleEvent, payload || {});
    //         yield put({
    //             type: 'setStates',
    //             payload: apiResponse,
    //             key: 'singleEvent',
    //         });
    //         return Promise.resolve(apiResponse);

    //     } catch (error) {
    //         // extract the error response from the server
    //         return Promise.reject(error);
    //     }
    //     // if (err) {
    //     //   // some api level error occurred. This can be handled in dispatch
    //     //   return Promise.reject(err);
    //     // }
    //     // return apiResponse;
    // },
    *getMembership({ payload }, { call, put }) {
      try {
        const apiResponse = yield call(getMembership, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'aaa',
        });
        return Promise.resolve(apiResponse);
      } catch (error) {
        // extract the error response from the server
        return Promise.reject(error);
      }
    },
    *getSingleMemberShipPlan({ payload }, { call, put }) {
      try {
        const apiResponse = yield call(getSingleMemberShipPlan, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'singleEvent',
        });
        return Promise.resolve(apiResponse);
      } catch (error) {
        // extract the error response from the server
        return Promise.reject(error);
      }
    },
    *updateMemberShipPlans({ payload }, { call }) {
      // let apiResponse;
      // let err;
      try {
        const apiResponse = yield call(updateMemberShipPlans, payload);
        // yield put({
        //   type: 'setStates',
        //   payload: apiResponse,
        //   key: 'deleteVisitor',
        // });
        return Promise.resolve(apiResponse);
      } catch (error) {
        // extract the error response from the server
        return Promise.reject(error);
      }
      // if (err) {
      //   // some api level error occurred. This can be handled in dispatch
      //   return Promise.reject(err);
      // }
      // return apiResponse;
    },
    *addMembershipPlan({ payload }, { call }) {
      // let apiResponse;
      // let err;
      try {
        const apiResponse = yield call(addMembershipPlan, payload || {});
        // yield put({
        //   type: 'setStates',
        //   payload: apiResponse,
        //   key: 'deleteVisitor',
        // });
        return Promise.resolve(apiResponse);
      } catch (error) {
        // extract the error response from the server
        return Promise.reject(error);
      }
      // if (err) {
      //   // some api level error occurred. This can be handled in dispatch
      //   return Promise.reject(err);
      // }
      // return apiResponse;
    },
  },

  reducers: {
    setStates(state, { payload, key }) {
      return {
        ...state,
        [key]: payload,
      };
    },
  },
};
export default Model;
