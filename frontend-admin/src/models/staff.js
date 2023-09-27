import {
  createStaff,
  getStaffList,
  getStaffMember,
  inviteUser,
  disableStaff,
  getStaffDetails,
  updateStaffDetails,
  staffClassAssociation,
  deleteStaffClassAssociation,
  createEmployee,
} from '@/services/staff';

const Model = {
  namespace: 'staff',
  state: {
    0: null,
    classInfo: null,
    staffDetails: null,
  },
  effects: {
    *createStaff({ payload, cb }, { call }) {
      try {
        const apiResponse = yield call(createStaff, payload);
        return apiResponse;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *createEmployee({ payload, cb }, { call }) {
      const res = yield call(createEmployee, payload);
      if (cb) cb(res);
      return res;
    },
    *inviteUser({ payload, cb }, { call }) {
      const res = yield call(inviteUser, payload);
      if (cb) cb(res);
      return res;
    },
    *getStaffList({ payload }, { call, put }) {
      const res = yield call(getStaffList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'staffList',
      });
    },
    *getStaffMember({ payload }, { call, put }) {
      const res = yield call(getStaffMember, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getStaffMember',
      });
    },
    *disableStaff({ payload }, { call }) {
      const res = yield call(disableStaff, payload);
      return res;
    },
    *getStaffDetails({ payload }, { call, put }) {
      const response = yield call(getStaffDetails, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'staffDetails',
      });
    },
    *updateStaffDetails({ payload }, { call, put }) {
      const response = yield call(updateStaffDetails, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'staffDetails',
      });
      return response;
    },
    *staffClassAssociation({ payload }, { call }) {
      const res = yield call(staffClassAssociation, payload);
      return res;
    },
    *deleteStaffClassAssociation({ payload }, { call }) {
      const res = yield call(deleteStaffClassAssociation, payload);
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
