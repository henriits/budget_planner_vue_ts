import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/style.css';

import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(Toast);
app.mount('#app');
