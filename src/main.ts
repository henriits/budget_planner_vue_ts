import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/base.css';
import './assets/components.css';
import './assets/layout.css';
import './assets/transactions.css';
import './assets/darkmode.css';

import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(Toast);
app.mount('#app');
