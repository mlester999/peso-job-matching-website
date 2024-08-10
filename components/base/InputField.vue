<script setup>
const props = defineProps({
    id: String,
    modelValue: String,
    title: String,
    type: String,
    errorMessage: String,
    disabled: Boolean,
    class: String
})

defineEmits(['update:modelValue']);
</script>

<template>
    <label :for="label" class="block text-sm font-medium leading-6 text-gray-900">{{ title }}
    </label>
    <div class="mt-2">
        <input :id="label" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :name="label"
            :type="type" :autocomplete="id" :disabled="disabled"
            :class="['block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6', props.class]" />
    </div>
    <p v-if="errorMessage" class="text-red-600 text-sm mt-1">{{ errorMessage }}</p>
</template>