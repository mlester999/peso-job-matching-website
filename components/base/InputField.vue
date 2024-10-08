<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    id: String,
    modelValue: String,
    title: String,
    type: String,
    errorMessage: String,
    disabled: Boolean,
    class: String,
    isContactNumber: Boolean,
    isNumber: Boolean,
})

const emit = defineEmits(['update:modelValue']);

const modelValue = ref(props.modelValue);

const checkDigit = (event) => {
    if (props.isNumber && event.key.length === 1 && isNaN(Number(event.key))) {
        event.preventDefault();
    }
};

const handleInput = (event) => {
    let value = event.target.value;
    if (props.isContactNumber) {
        // Allow only numbers and restrict to 10 digits
        if (/^\d*$/.test(value) && value.length <= 10) {
            modelValue.value = value;
            emit('update:modelValue', value);
        } else {
            // Remove any invalid characters and trim to 10 digits
            value = value.slice(0, 10).replace(/\D/g, '');
            modelValue.value = value;
            emit('update:modelValue', value);
            event.target.value = value;
        }
    } else {
        modelValue.value = value;
        emit('update:modelValue', value);
    }

}

// Watch for changes in props.modelValue and update modelValue ref accordingly
watch(() => props.modelValue, (newVal) => {
    modelValue.value = newVal;
});
</script>

<template>
    <label :for="label" class="block text-sm font-medium leading-6 text-gray-900">{{ title }}
    </label>
    <div class="mt-2">
        <p v-if="isContactNumber" class="absolute text-sm mt-2 ml-2">+63</p>
        <input :id="id" :value="modelValue" @input="handleInput" @keydown="checkDigit" :name="label" :type="type"
            :autocomplete="id" :disabled="disabled"
            :class="['block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 disabled:bg-gray-200', props.class, props.isContactNumber ? 'pl-10' : '']" />
    </div>
    <p v-if="errorMessage" class="text-red-600 text-sm mt-1">{{ errorMessage }}</p>
</template>