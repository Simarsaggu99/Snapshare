import {
  getAllReportedPost,
  restorePost,
  deleteReportedPost,
  singleRestorePost,
} from '@/services/reported';
const Model = {
  namespace: 'reported',
  state: {
    0: null,

    allReportedPost: null,
    singleRestorePost: null,
  },
  effects: {
    *getAllReportedPost({ payload }, { call, put }) {
      try {
        const res = yield call(getAllReportedPost, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'allReportedPost',
        });

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *restorePost({ payload }, { call, put }) {
      try {
        const res = yield call(restorePost, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteReportedPost({ payload }, { call, put }) {
      try {
        const res = yield call(deleteReportedPost, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *singleRestorePost({ payload }, { call, put }) {
      try {
        const res = yield call(singleRestorePost, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'singleRestorePost',
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
