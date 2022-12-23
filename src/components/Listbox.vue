<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

interface Provider {
  name: string
  code: string
}

withDefaults(defineProps<{ provider: string }>(), { provider: 'wechat' })
const emits = defineEmits(['update:provider'])

const providers: Provider[] = [
  { name: '微信支付', code: 'wechat' },
  { name: '支付宝', code: 'alipay' },
  { name: '火币-币币交易', code: 'huobi' },
]
const selectedProvider = ref(providers[0])

watch(selectedProvider, (val) => {
  emits('update:provider', val.code)
})
</script>

<template>
  <div>
    <Listbox v-model="selectedProvider">
      <div class="relative">
        <ListboxButton
          class="border-2 relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 border-neutral-300 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
        >
          <span class="block truncate">{{ selectedProvider.name }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base border-neutral-300 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-for="person in providers" v-slot="{ active, selected }" :key="person.name"
              :value="person" as="template"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4" :class="[
                  active ? 'bg-blue-100 text-gray-900' : 'text-gray-900',
                ]"
              >
                <span
                  class="block truncate" :class="[
                    selected ? 'font-medium' : 'font-normal',
                  ]"
                >{{ person.name }}</span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
