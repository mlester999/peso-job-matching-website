<template>
    <div class="qkb-board-header">
        <slot name="header">
            <div class="qkb-board-header__title">{{ botTitle }}</div>
        </slot>
    </div>
</template>


<script setup>

const props = defineProps({
    botTitle: {
        type: String,
        default: 'Chatbot'
    }
})
</script>