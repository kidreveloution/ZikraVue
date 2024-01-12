import { createApp } from 'vue';
import App from './App.vue';
import store from './store/store'; // Ensure this is correct
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas, far, fab);




const app = createApp(App);
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon);

// Global variables for app
app.config.globalProperties.$rootEndpoint = "https://api.zikramap.com/";

app.config.globalProperties.$showMemoriesEndpoint = app.config.globalProperties.$rootEndpoint + "getMemories/";
app.config.globalProperties.$showAllMemoriesEndpoint = app.config.globalProperties.$rootEndpoint + "getAllMemories/";


// Global Variables for Calendar.vue

// Global Variables for GoogleMap.vue
app.config.globalProperties.$map = null;



// app.config.globalProperties.$bounds = null;


app.mount('#app');
