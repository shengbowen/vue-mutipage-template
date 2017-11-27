export const actions = {
  UPDATE_LOADING: 'UPDATE_LOADING',
  UPDATE_DIRECTION: 'UPDATE_DIRECTION',
  LOGIN: 'LOGIN'
};

export default {
  state: {
    isLoading: false,      // 异步加载时 显示loading
    direction: 'forward',  // 判断当前的浏览行为是前进还是后退
    login: {}
},
  mutations: {
    [actions.LOGIN](state, loginData) {
      Object.assign(state, {
        login: loginData
      });
    },

    [actions.UPDATE_LOADING](state, payload) {
      Object.assign(state, payload);
    },

    [actions.UPDATE_DIRECTION](state, direction) {
      Object.assign(state, {direction: direction});
    }
  },
  actions: {
    [actions.UPDATE_LOADING]({commit}, payload) {
      commit(actions.UPDATE_LOADING, payload);
    },

    [actions.UPDATE_DIRECTION]({commit}, direction) {
      commit(actions.UPDATE_DIRECTION, direction);
    }
  }
};
