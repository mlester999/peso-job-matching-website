<script setup>
const props = defineProps({
    id: String,
    modelValue: String,
    title: String,
    type: String,
    placeholder: String,
    disabled: Boolean,
    errorMessage: String,
    class: String
});
</script>

<template>
    <label :for="props.id" class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">{{ props.title }}</label>
    <div class="mt-2 sm:col-span-2 sm:mt-0">
        <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" :id="props.id"
            :name="props.id" :disabled="props.disabled"
            :class="['block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6', props.class]">
            <slot />
        </select>

        <p v-if="props.errorMessage" class="text-red-600 text-sm mt-1">
            {{ props.errorMessage }}
        </p>
    </div>


</template>