<template>
    <div class="slider-container">
      <input type="range" :min="0" :max="formatted_ticks.length - 1" v-model="sliderValue" @input="onInput">
      <ul class="ticks">
        <li v-for="(tick, index) in formatted_ticks" :key="tick" :style="{left: `${index / (formatted_ticks.length - 1) * 100}%`}">{{ tick }}</li>
      </ul>
    </div>
</template>
  
<script>
  import $ from 'jquery';

  export default {
    name: 'DynamicRangeSlider',
    computed:{
        watch_bounds () {
            return this.$store.state.mapBounds.bounds
        },
    },
    watch:
    {
        watch_bounds(newBounds){
            this.getMemoriesForTimeline(newBounds)
        }
    },
    data() {
      return {
        internalTicks: [], // Define your ticks as strings
        sliderValue: 0,
        formatted_ticks: []
      };
    },
    
    methods: {
      onInput() {
        this.sliderValue = Math.round(this.sliderValue);
        var dateObj = new Date(this.internalTicks[this.sliderValue]);
        
        var formattedDate = dateObj.getFullYear() + '-' + 
                            dateObj.toLocaleString('default', { month: 'short' }) + '-' + 
                            ('0' + dateObj.getDate()).slice(-2);
        
        this.$store.dispatch('showDate/setShowDate', formattedDate);

      },
      getMemoriesForTimeline(bounds) {
            $.ajax({
                url: process.env.VUE_APP_ZIKRA_API_SHOW_MEM,
                type: "GET",
                headers:{
                    "zikra_main":process.env.VUE_APP_ZIKRA_API_KEY
                },
                data: {
                    "ne_lat": bounds.getNorthEast().lat(),
                    "ne_long": bounds.getNorthEast().lng(),
                    "sw_lat": bounds.getSouthWest().lat(),
                    "sw_long": bounds.getSouthWest().lng(),
                    "center_lat": bounds.getCenter().lat(),
                    "center_long": bounds.getCenter().lng(),
                },
                success: (events) => {
                    this.formatted_ticks = this.convertDates(events)
                    this.internalTicks = events
                },
                error: (err) => {
                    console.error(err);
                },
            });
        },
        convertDates(events) {
            return events.map(event => {
                const date = new Date(event);
                const month = date.toLocaleString('en-US', { month: 'short' });
                const day = ("0" + date.getDate()).slice(-2);
                return `${month} ${day}`;
            });
        }
    }
  };
  </script>
  
  
  <style scoped>
  .slider-container {
    position: relative; /* Keep as relative or absolute as per your layout */
    z-index: 9999; /* Ensures it stays on top */
    width: 80%; /* Adjust to desired width, e.g., 50% for half-width */
    margin: 0 auto; /* Centers the slider */
    top: -100px; /* Adjust as needed */
    padding: 0;
  }
  
  input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    height: 25px;
    background: #464343;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
    margin: 0;
    border-radius: 12px; /* Rounded edges */
  }
  
  input[type=range]:hover {
    opacity: 1; /* Fully opaque on hover */
  }
  
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default appearance */
    appearance: none;
    width: 35px; /* Increased width for the thumb */
    height: 35px; /* Increased height for the thumb */
    background: #4c57af; /* Custom color for the thumb */
    cursor: pointer; /* Cursor changes to pointer when hovering over the thumb */
    border-radius: 50%; /* Makes the thumb circular */
    border: 1px solid black; /* Adds a border to the thumb */
  }
  
  input[type=range]::-moz-range-thumb {
    width: 35px; /* Increased width for the thumb */
    height: 35px; /* Increased height for the thumb */
    background: #4c57af; /* Custom color for the thumb */
    cursor: pointer; /* Cursor changes to pointer when hovering over the thumb */
    border-radius: 50%; /* Makes the thumb circular */
    border: 1px solid black; /* Adds a border to the thumb */
  }
  
  .ticks {
    list-style: none;
    padding: 0;
    margin: 0;
    position: absolute;
    width: 100%;
    top: 35px; /* Position the ticks below the slider */
    display: flex;
    justify-content: space-between;
    font-size: 12px; /* Increases the font size for better readability */
    color: black; /* Text color */
    font-weight: bold; /* Makes the text bold */

}
  
.ticks li {
    position: absolute;
    transform: translateX(-50%);
    color: #000000; /* Brighter color for better visibility */
    text-shadow: 1px 1px 2px rgba(0,0,0,0.7); /* Text shadow for contrast */
    background-color: rgba(255, 255, 255, 0.5); /* Semi-transparent background */
    padding: 2px 4px; /* Padding around text */
    border-radius: 4px; /* Optional: rounded corners for the background */
    font-size: 14px; /* Slightly larger font size */
    white-space: nowrap; /* Prevents the text from wrapping */
    text-overflow: ellipsis; /* Adds an ellipsis if the text overflows */
    overflow: hidden; /* Hides any overflow that doesn't fit in the max-width */
    max-width: 90px; /* Sets a maximum width for each tick label (adjust as needed) */
  }
</style>

  
  