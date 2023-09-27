import { getAllTransactions, updateTransactionStatus } from '@/services/transaction';

const Model = {
  namespace: 'transaction',
  state: {
    contentID: null,
    allTransactionList: null,
  },
  effects: {
    *getAllTransaction({ payload }, { call, put }) {
      const res = yield call(getAllTransactions, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'allTransactionList',
      });
      return res;
    },
    *updateTransactionStatus({ payload }, { call, put }) {
      const res = yield call(updateTransactionStatus, payload);
      // yield put({
      //   type: 'setStates',
      //   payload: res,
      //   key: 'updateStatus',
      // });
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
