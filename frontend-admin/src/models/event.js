import {
  getEventDetail,
  getVisitors,
  getSingleRegistration,
  getVendors,
  getPartners,
  register,
  registerExhibitor,
  submitEventDetails,
  updateEventDetails,
  deleteRegistration,
  getIdCardPdfDoc,
  getExhibitors,
  getStats,
  getLeadScanners,
  checkUniqueVisitor,
  getDashboardStats,
  addLeadScanner,
  addEvent,
  removeLeadScanner,
  getEvent,
  deleteEvent, getSingleEvent
} from '@/services/event'; 
import { getLeadsList } from '@/services/leads';

const Model = {
  namespace: 'event',
  state: {
    registeredLists: [],
    registrationDetail: null,
    eventDetail: null,
    deleteVisitor: null,
    showGeneratePdf: false,
    idCardPdfUrl: '',
    eventList: null,
    singleEvent: null
  },
  effects: {
    *getStats({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getStats, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'stats',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *register({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(register, payload || {});
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },

    *registerExhibitor({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(registerExhibitor, payload || {});
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },

    *showGeneratePdf({ payload }, { put }) {
      yield put({
        type: 'setStates',
        payload: payload?.body?.value,
        key: 'showGeneratePdf',
      });
      if (!payload?.body?.value) {
        yield put({
          type: 'setStates',
          payload: '',
          key: 'idCardPdfUrl',
        });
      }
    },
    *submitEventDetails({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(submitEventDetails, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse?.data,
          key: 'eventDetail',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *updateEventDetails({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(updateEventDetails, payload || {});
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },

    *addLeadScanner({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(addLeadScanner, payload);
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *addEvent({ payload }, { call }) {
      let apiResponse;
      try {
        apiResponse = yield call(addEvent, payload);
        return apiResponse;
      } catch (error) {
        // extract the error response from the server
        return Promise.reject(error);
      }
    },
    *removeLeadScanner({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(removeLeadScanner, payload);
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getVisitors({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getVisitors, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'registeredLists',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getExhibitors({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getExhibitors, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'registeredExhibitors',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getSingleRegistration({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getSingleRegistration, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'registrationDetail',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *deleteRegistration({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(deleteRegistration, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'deleteVisitor',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getEventDetail(_, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getEventDetail);
        yield put({
          type: 'setStates',
          payload: apiResponse?.event,
          key: 'eventDetail',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *setIsVisibleMultiple({ payload }, { put }) {
      yield put({
        type: 'setStates',
        payload: payload?.value,
        key: 'isVisibleMutlipleModal',
      });
    },
    *getVendors({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getVendors, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'vendors',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getPartners({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getPartners, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'partners',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getDashboardStats({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getDashboardStats, payload || {});
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getLeads({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getLeadsList, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'leads',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getLeadScanners({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getLeadScanners, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'leadScanners',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getIdCardPdfDoc({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getIdCardPdfDoc, payload || {});
        yield put({
          type: 'setStates',
          payload: apiResponse?.url,
          key: 'idCardPdfUrl',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },

    *checkUniqueVisitor({ payload }, { call }) {
      try {
        const res = yield call(checkUniqueVisitor, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getEvent(_, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getEvent);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'eventList',
        });
        return apiResponse;
      } catch (error) {
        return Promise.reject(err);
      }
    },
    // duggout
    *deleteEvent({ payload }, { call }) {
      // let apiResponse;
      // let err;
      try {
        const apiResponse = yield call(deleteEvent, payload || {});
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
    *updateEvent({ payload }, { call }) {
      // let apiResponse;
      // let err;
      try {
        const apiResponse = yield call(updateEvent, payload || {});
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
    *getSingleEvent({ payload }, { call, put }) {
      // let apiResponse;
      // let err;
      try {
        const apiResponse = yield call(getSingleEvent, payload || {});
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
