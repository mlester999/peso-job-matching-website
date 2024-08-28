<script setup>
import { computed, ref } from 'vue';
import {
    ChevronRightIcon,
    ChevronDownIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
    title: String,
    height: String
})

const showMenu = ref(false);

const setDropdownHeight = computed(() => {
    return showMenu.value ? props.height : "h-0"
});

const toggleShow = () => {
    showMenu.value = !showMenu.value;
}
</script>

<template>
    <li class="font-semibold text-sm list-none block">
        <div class="flex items-center justify-between mb-2 cursor-pointer p-3 text-blue-200 hover:text-white hover:bg-blue-700 rounded-md"
            @click="toggleShow">
            {{ title }}
            <ChevronRightIcon v-if="!showMenu" class="h-5 w-5" />
            <ChevronDownIcon v-else="!showMenu" class="h-5 w-5" />

        </div>
        <ul class="ml-4 space-y-4 overflow-hidden dropdown-menu font-normal" :class="setDropdownHeight">
            <slot></slot>
        </ul>
    </li>
</template>