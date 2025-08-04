import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { store } from '@/plugins/store';
import { router } from '@/plugins/router';

const app = createApp(App)
app.use(Antd)
app.use(VueQueryPlugin)
app.use(store)
app.use(router)
app.mount('#app')