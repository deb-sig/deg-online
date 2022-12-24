<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { getVersion, translate } from '~/composables/runner'
import Listbox from '~/components/Listbox.vue'

const listbox = ref<typeof Listbox>()
const count = ref(0)
const verInfo = ref('')
const inputContent = useLocalStorage('deg/bill-input', '')
const configContent = useLocalStorage('deg/config-input', '')
const outputContent = ref('')
const providerCode = ref('wechat')
onMounted(async () => {
  verInfo.value = await getVersion()
})

const translateBill = async () => {
  outputContent.value = await translate(providerCode.value, inputContent.value, configContent.value)
}
</script>

<template>
  <!-- <h1>{{ msg }}</h1> -->
  <div class="mx-auto mt-8 w-4/5">
    <div class="flex my-3">
      <Listbox v-model="providerCode" class="w-60" />
      <button
        type="button" class="ml-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        @click="translateBill"
      >
        生成
      </button>
    </div>
    <div class="grid grid-cols-2 gap-6">
      <div>
        <textarea
          id="input" v-model="inputContent" rows="24"
          class="block whitespace-pre-wrap p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="账单文件"
        />

        <textarea
          v-model="configContent" rows="8"
          class="block whitespace-pre-wrap p-2.5 mt-5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="配置文件"
        />
      </div>
      <textarea
        id="output1" v-model="outputContent" rows="32" disabled
        class="block whitespace-pre-wrap p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="输出"
      />
    </div>
  </div>
  <h1 id="version" class="mt-6 text-center">
    {{ verInfo }}
  </h1>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
