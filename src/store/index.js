import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user_name: "",
  },
  mutations: {
    set_user_name(state, user_name) {
      state.user_name = user_name;
    },
  },
  actions: {
    set_user_name({ commit }, user_name) {
      commit("set_user_name", user_name);
    },
  },
  modules: {},
});
