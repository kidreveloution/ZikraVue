<template>
  <div id="app">
    <GoogleMap />
    <Calandar />
    <Timeline />
  </div>
</template>

<script>
import GoogleMap from './components/GoogleMap.vue';
import Calandar from './components/Calandar.vue';
import Timeline from './components/Timeline.vue';

export default {
  name: 'App',
  components: {
    GoogleMap,
    Calandar,
    Timeline,
  },
};
</script>

<style>
* {
       margin: 0; /* Setting all margins to 0 */
   }
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
