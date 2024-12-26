import Aura from '@primevue/themes/aura'
import Button from "primevue/button";
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import routes from '~pages'
import App from './app.vue'
import '@/assets/base.scss'
// import 'primevue/resources/themes/aura-dark-cyan/theme.css'
// import Lara from '@/presets/lara';      //import preset
import './index.scss'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

const app = createApp(App)

app.use(router).mount('#app')
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.component("Button", Button);

self.onerror = function(message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`,
  )
}
