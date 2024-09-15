<template>
    <div :class="bubbleClass" class="qkb-msg-bubble">
        <div v-if="message.agent === 'bot'" class="qkb-msg-avatar">
            <div class="qkb-msg-avatar__img">&nbsp;</div>
        </div>
        <MessageBubbleSingleText v-if="componentType === 'SingleText'" :main-data="message" />
        <MessageBubbleButtonOptions v-else-if="componentType === 'ButtonOptions'" :main-data="message" />
        <div v-if="message.createdAt" class="qkb-msg-bubble__time">
            {{ message.createdAt }}
        </div>
    </div>
</template>


<script setup>
import { computed } from 'vue'
import SingleText from './SingleText'
import ButtonOptions from './ButtonOptions'

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
})

const bubbleClass = computed(() => {
    return props.message.agent === 'bot'
        ? 'qkb-msg-bubble--bot'
        : 'qkb-msg-bubble--user'
})

const componentType = computed(() => {
    switch (props.message.type) {
        case 'button':
            return 'ButtonOptions'
        default:
            return 'SingleText'
    }
})
console.log('componentType: ', componentType.value);
</script>