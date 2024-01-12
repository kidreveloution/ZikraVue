// src/store/index.js
import { createStore } from 'vuex';
import mapBounds from './modules/mapBounds';
import showDate from './modules/showDate';

export default createStore({
  modules: {
    mapBounds,
    showDate,
  }
});
