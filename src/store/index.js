import { createStore } from 'vuex';
import { getUserInfoAPI } from '../api/user';

const store = createStore({
  state() {
    return {
      mainLoading: true,
      isLogin: false,
      user: {
        username: '',
        nickname: 'Anonymous User',
      },
      userProperties: {
        avatar: null
      }
    };
  },
  mutations: {
    setMainLoading(state, payload) {
      state.mainLoading = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setIsLogin(state, payload) {
      state.isLogin = payload
    }
  },
  actions: {
    setMainLoading({ commit }, payload) {
      if (payload) {
        commit('setMainLoading', true);
      } else {
        setTimeout(() => {
          commit('setMainLoading', false);
        }, 600);
      }
    },
    getUserInfo({ commit }) {
      getUserInfoAPI().then(res => {
        commit('setUser', res.data);
        commit('setIsLogin', true);
      });
    }
  },
});

export default store;
