import {
  storeFormsDate,
  getFormData,
  getForms,
  getStats,
  editForm,
  deleteForm,
} from '@/services/forms';

const Model = {
  namespace: 'forms',
  state: { formData: null, formByType: null },
  effects: {
    *storeFormsDate({ payload }, { call }) {
      const res = yield call(storeFormsDate, payload);
      return res;
    },
    *editForm({ payload }, { call }) {
      const res = yield call(editForm, payload);
      return res;
    },
    *deleteForm({ payload }, { call }) {
      const res = yield call(deleteForm, payload);
      return res;
    },
    *getFormData({ payload }, { call, put }) {
      const res = yield call(getFormData, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'formData',
      });
      return res;
    },
    *getForms({ payload }, { call, put }) {
      const res = yield call(getForms, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'formByType',
      });
      return res;
    },
    *getStats({ payload }, { call, put }) {
      const res = yield call(getStats, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'stats',
      });
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
