import {
  bountyUserList,
  createBounty,
  downloadBounty,
  getBounty,
  getExpireBounty,
} from '@/services/bounty';

const Model = {
  namespace: 'bounty',
  state: {
    contentID: null,
    allBountyList: null,
    expireBounty: null,
  },
  effects: {
    *createBounty({ payload }, { call }) {
      const res = yield call(createBounty, payload);
      return res;
    },
    //used for live and upcoming
    *getBounty({ payload }, { call, put }) {
      const res = yield call(getBounty, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'allBountyList',
      });
      return res;
    },
    *getExpireBounty({ payload }, { call, put }) {
      const res = yield call(getExpireBounty, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'expireBounty',
      });
      return res;
    },
    *bountyUserList({ payload }, { call, put }) {
      const res = yield call(bountyUserList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'bountyUserList',
      });
      return res;
    },
    *downloadBounty({ payload }, { call, put }) {
      try {
        const res = yield call(downloadBounty, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'downloadBounty',
        });
        return res;
      } catch (err) {
        Promise.reject(err);
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
