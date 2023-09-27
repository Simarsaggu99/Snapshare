import { getContactUs,getSingleContactUs } from '@/services/contactUs';

const Model = {
  namespace: 'contactUs',
  state: {
    registeredLists: [],
    registrationDetail: null,
    eventDetail: null,
    deleteVisitor: null,
    showGeneratePdf: false,
    idCardPdfUrl: '',
    contactList: null,
  },
  effects: {
    *getContactUs(_, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getContactUs);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'contactList',
        });
      } catch (error) {
        err = error;
      }
      if (err) {
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getSingleContactUs(_, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getSingleContactUs);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'contactList',
        });
      } catch (error) {
        err = error;
      }
      if (err) {
        return Promise.reject(err);
      }
      return apiResponse;
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
