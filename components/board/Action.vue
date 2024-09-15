<template>
    <div :class="actionClass" class="qkb-board-action">
        <div class="qkb-board-action__wrapper">
            <div class="qkb-board-action__msg-box">
                <input type="text" v-model="messageText" ref="qkbMessageInput" :disabled="inputDisable"
                    :placeholder="inputPlaceholder" @keydown.enter="sendMessage"
                    class="qkb-board-action__input rounded-xl bg-gray-100 border-0 " />
                <div v-if="inputDisablePlaceholder && inputDisable" class="qkb-board-action__disable-text">
                    <span>{{ inputDisablePlaceholder }}</span>
                </div>
            </div>
            <div class="qkb-board-action__extra">
                <slot name="actions" />
                <button class="qkb-action-item qkb-action-item--send" @click="sendMessage">
                    <slot name="sendButton">
                        <PaperAirplaneIcon class="qkb-action-icon qkb-action-icon--send" />
                    </slot>
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue'
import {
    PaperAirplaneIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
    inputPlaceholder: String,
    inputDisablePlaceholder: String,
    inputDisable: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['msg-send'])

const messageText = ref(null)

const actionClass = computed(() => {
    const actionClasses = []

    if (props.inputDisable) {
        actionClasses.push('qkb-board-action--disabled')
    }

    if (messageText.value) {
        actionClasses.push('qkb-board-action--typing')
    }

    return actionClasses
})

const sendMessage = () => {
    if (messageText.value) {
        emit('msg-send', { text: messageText.value })
        messageText.value = null
    }
}

onMounted(() => {
    const inputElement = ref(null)
    if (inputElement.value) {
        inputElement.value.focus()
    }
})
</script>