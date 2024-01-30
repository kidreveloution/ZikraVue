<template>
    <div class="slider-container">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        v-model="value"
        @input="onInput"
        class="slider"
      >
      <div class="value-display">
        Selected Value: {{ value }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SnapRangeSlider',
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      step: {
        type: Number,
        default: 10
      }
    },
    data() {
      return {
        value: this.min // Initialize with the minimum value
      };
    },
    methods: {
      onInput(event) {
        const val = +event.target.value;
        const snappedValue = Math.round(val / this.step) * this.step;
        this.value = snappedValue;
      }
    }
  };
  </script>
  
  <style scoped>
  .slider-container {
    margin: 20px;
  }
  
  .slider {
    width: 100%;
    height: 25px;
    background: #ddd;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }
  
  .slider:hover {
    opacity: 1;
  }
  
  .value-display {
    margin-top: 10px;
    font-size: 16px;
    color: #333;
  }
  </style>
  