import {
  getCountriesList,
  getCountryStates,
  uploadContent,
  dashboardStats,
} from '@/services/common';

const Model = {
  namespace: 'common',
  state: {
    stateCodes: null,
    ProductTypesList: null,
    ProductSubTypesList: null,
    contentId: null,
    isVisible: false,
    dashboardStats: null,
  },
  effects: {
    *getStateCodes({ payload }, { call, put }) {
      const res = yield call(getCountryStates, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'stateCodes',
      });
    },
    *getCountriesList({ payload }, { call, put }) {
      const res = yield call(getCountriesList, payload);
      yield put({
        type: 'setStates',
        payload: res?.data || [],
        key: 'countriesList',
      });
      return res?.data || [];
    },
    *uploadContent({ payload }, { call, put }) {
      const res = yield call(uploadContent, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'contentId',
      });
      return res;
    },
    *showBuySubscription({ payload }, { put }) {
      yield put({
        type: 'setStates',
        payload: payload?.value,
        key: 'isVisible',
      });
    },
    *dashboardStats({ payload }, { call, put }) {
      try {
        const res = yield call(dashboardStats, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'dashboardStats',
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
