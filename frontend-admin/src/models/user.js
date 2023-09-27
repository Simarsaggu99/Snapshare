import {
  queryCurrent,
  updateUserProfile,
  userAvatar,
  userRegister,
  forgotUserPassword,
  updateUserPassword,
  updatePassword,
  signUp,
  checkUniqueness,
  addPartner,
  addLicense,
  getAllUser,
} from '@/services/user';
import { setAuthority } from '@/utils/authority';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {
      allUserList: null,
    },
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response?.role) {
        setAuthority(response?.role);
      }
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *userRegister({ payload, cb }, { call }) {
      const res = yield call(userRegister, payload);
      if (cb) cb(res);
    },
    *updateCurrent({ payload }, { call, put }) {
      const res = yield call(updateUserProfile, payload);
      yield put({ type: 'fetchCurrent' });
      return res;
    },
    *updatePassword({ payload }, { call, put }) {
      const res = yield call(updatePassword, payload);
      yield put({ type: 'fetchCurrent' });
      return res;
    },
    *userAvatarUpload({ payload, cb }, { call }) {
      const res = yield call(userAvatar, payload);
      if (cb) cb(res);
    },
    *userForgotPassword({ payload }, { call }) {
      const res = yield call(forgotUserPassword, payload);
      return res;
    },
    *resetUserPassword({ payload }, { call }) {
      const res = yield call(updateUserPassword, payload);
      return res;
    },
    *signUp({ payload }, { call }) {
      const res = yield call(signUp, payload);
      return res;
    },
    *checkUniqueness({ payload }, { call }) {
      try {
        const res = yield call(checkUniqueness, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *addPartner({ payload }, { call }) {
      try {
        const res = yield call(addPartner, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *addLicense({ payload }, { select, call, put }) {
      const currentUser = yield select((state) => state.user.currentUser);
      try {
        const res = yield call(addLicense, payload);
        const updatedCurrentUserState = {
          ...currentUser,
          remainingInvites: currentUser?.remainingInvites + 1,
        };
        yield put({
          type: 'saveCurrentUser',
          payload: updatedCurrentUserState,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
