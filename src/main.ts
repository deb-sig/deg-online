import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
// @ts-ignore
import { init_wasm } from "~/composables/wasm/wasm_init.js"

init_wasm()
createApp(App).mount('#app')
