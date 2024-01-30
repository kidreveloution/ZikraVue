// src/store/modules/mapBounds.js
export default {
    namespaced: true,
    state: {
      bounds: null,
    },
    mutations: {
      SET_BOUNDS(state, bounds) {
        state.bounds = bounds;
      }
    },
    actions: {
      setBounds({ commit }, bounds) {
        commit('SET_BOUNDS', bounds);
      }
    },
    getters: {
      // Getter to access the bounds state
      getBounds(state) {
        
        return state.bounds;
      }
    }
  };
  