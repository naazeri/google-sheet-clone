import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// import ClickOutside from './directives/ClickOutsideDirective'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.directive('click-outside', ClickOutside)

app.mount('#app')
