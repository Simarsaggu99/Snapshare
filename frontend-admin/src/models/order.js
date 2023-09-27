import { orderList, getOrder } from '@/services/order';

const Model = {
  namespace: 'order',
  state: { orderList: null, getOrder: null },
  effects: {
    *orderList({ payload }, { call, put }) {
      const res = yield call(orderList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'orderList',
      });
      return res;
    },
    *getOrder({ payload }, { call, put }) {
      const res = yield call(getOrder, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getOrder',
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
