import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
// @ts-expect-error load failed
import { init_wasm } from '~/composables/wasm/wasm_init.js'

init_wasm()
createApp(App).mount('#app')
