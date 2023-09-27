import {
  getAllUser,
  getSingleUser,
  deductCoins,
  suspendUser,
  sendWarning,
  sendSpankee,
  getSingleUserWarning,
  getSingleUserSpankee,
} from '@/services/users';
const Model = {
  namespace: 'users',
  state: {
    0: null,
    allUserList: null,
    singleUser: null,
    singleUserWarning: null,
    singleUserSpankee: null,
  },
  effects: {
    *getAllUser({ payload }, { call, put }) {
      try {
        const res = yield call(getAllUser, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'allUserList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getSingleUser({ payload }, { call, put }) {
      try {
        const res = yield call(getSingleUser, payload);

        yield put({
          type: 'setStates',
          payload: res,
          key: 'singleUser',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deductCoins({ payload }, { call }) {
      try {
        const res = yield call(deductCoins, payload);

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *suspendUser({ payload }, { call }) {
      try {
        const res = yield call(suspendUser, payload);

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *sendWarning({ payload }, { call }) {
      try {
        const res = yield call(sendWarning, payload);

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *sendSpankee({ payload }, { call }) {
      try {
        const res = yield call(sendSpankee, payload);

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getSingleUserWarning({ payload }, { call, put }) {
      try {
        const res = yield call(getSingleUserWarning, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'singleUserWarning',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getSingleUserSpankee({ payload }, { call, put }) {
      try {
        const res = yield call(getSingleUserSpankee, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'singleUserSpankee',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
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
