import {
  registerServiceUser,
  serviceUserList,
  getServiceUser,
  editServiceUser,
} from '@/services/serviceUser';

const Model = {
  namespace: 'serviceUser',
  state: { serviceUserList: null, getServiceUser: null },
  effects: {
    *registerServiceUser({ payload }, { call }) {
      const res = yield call(registerServiceUser, payload);
      return res;
    },
    *editServiceUser({ payload }, { call }) {
      const res = yield call(editServiceUser, payload);
      return res;
    },
    *serviceUserList({ payload }, { call, put }) {
      const res = yield call(serviceUserList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'serviceUserList',
      });
      return res;
    },
    *getServiceUser({ payload }, { call, put }) {
      const res = yield call(getServiceUser, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getServiceUser',
      });
      return res;
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
