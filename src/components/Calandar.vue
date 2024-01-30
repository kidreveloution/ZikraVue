<template>
    <div id="dateDiv">
        <input type="text" id="datepicker" readonly />
    </div>
</template>

<script>
import Pikaday from "pikaday";
import "pikaday/css/pikaday.css"; // Import Pikaday CSS
import $ from 'jquery';
console.log('API Key:', process.env.VUE_APP_ZIKRA_API_KEY);

export default {
    name: "PikadayComponent",
    data() {
        return {
            picker: null,
        }
    },
    mounted() {
        this.picker = this.initializePikaday('2023-Oct-07');
    },
    computed:{
        watch_bounds () {
            return this.$store.state.mapBounds.bounds
        },
    },
    watch:
    {
        watch_bounds(newBounds){
            this.getMemoriesForCalendar(newBounds)
        }
    },
    methods: {
        initializePikaday(init_date) {
            this.$picker = new Pikaday({
                field: document.getElementById("datepicker"),
            });
            this.$picker.setDate(new Date(init_date));
            this.$store.dispatch('showDate/setShowDate', init_date);
        },
        update_pikaday(events) {
            // If picker already exists, destroy it
            if (this.$picker) {
                this.$picker.destroy();
            }
            this.$picker = new Pikaday({
                field: document.getElementById('datepicker'),
                onSelect: (date) => {
                    const showDate = date.toISOString();
                    console.log(showDate)
                    this.$store.dispatch('showDate/setShowDate', showDate); // Dispatch action
                },
                events: events
            });
            //this.$picker.setDate(new Date(showDate));

        },
        getMemoriesForCalendar(bounds) {
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
                    this.update_pikaday(events);
                },
                error: (err) => {
                    console.error(err);
                },
            });
        }
    },
    
};
</script>

<style scoped>
#datepicker {
    position: absolute;
    /* Corrected positioning */
    top: 0px;
    /* Adjust as needed */
    left: 0px;
    /* Adjust as needed */
    z-index: 10;
    /* Ensures it appears above other elements */

    /* Styling for a sleek and clean appearance */
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 8px 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    color: #333;
    width: 200px;
    /* Fixed width */

    transition: box-shadow 0.3s, transform 0.2s;
    /* Smooth transition */
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-15px);
    }

    60% {
        transform: translateY(-10px);
    }
}

#dateDiv {
    /* Other styles for #dateDiv */
    animation: bounce 5s ease-out;
}

#dateDiv {
    display: flex;
    position: absolute;
    top: 60px;
    /* Adjust as needed to place it at the desired location on the map */
    left: 10px;
    /* Adjust as needed */
    z-index: 10;
    /* Ensures it appears above the map */
    animation: bounce 1s ease-out;
}</style>
