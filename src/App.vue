<template>
  <div id="app">
    <GoogleMap :isMobile="isMobile" />
    <Calandar />
    <Timeline v-if="!isMobile" />
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
  data() {
    return {
      isMobile: false
    }
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 768;
    }
  }
};
</script>

<style>
* {
  margin: 0;
}

@media (max-width: 768px) {
  .hide-on-mobile {
    display: none !important;
  }
}
</style>
