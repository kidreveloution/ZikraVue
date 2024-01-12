// src/store/modules/showDate.js
export default {
    namespaced: true,
    state: {
      showDate: null,
    },
    mutations: {
      SET_SHOW_DATE(state, showDate) {
        state.showDate = showDate;
      }
    },
    actions: {
      setShowDate({ commit }, showDate) {
        commit('SET_SHOW_DATE', showDate);
      }
    },
    getters: {
      // Getter to access the showDate state
      getshowDate(state) {
        return state.showDate;
      }
    }
  };
  