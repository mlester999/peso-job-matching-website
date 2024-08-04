<script setup>
defineProps({
    type: String,
    title: String,
    disabled: Boolean
})
</script>

<template>
    <button :type="type" :disabled="disabled"
        class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        <slot></slot>
    </button>
</template>