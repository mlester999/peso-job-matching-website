<script setup>
const props = defineProps({
    title: String,
    description: String
})
</script>

<template>
    <div class="flex items-center gap-x-6 bg-blue-200 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 rounded-md">
        <p class="text-sm leading-6 text-gray-900">
            <strong class="font-semibold">{{ title }}</strong><svg viewBox="0 0 2 2"
                class="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
            </svg>{{ description }}&nbsp;
        </p>
        <div class="flex flex-1 justify-end">
        </div>
    </div>
</template>