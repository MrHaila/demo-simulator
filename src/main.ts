import { createApp } from 'vue'
import { loadSlim } from '@tsparticles/slim'
import Particles from '@tsparticles/vue3'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/index.css'

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Vue
const app = createApp(App)

app.use(createPinia())
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine)
  },
})

app.mount('#app')
