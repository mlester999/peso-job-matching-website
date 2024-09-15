<template>
    <div :class="uiClasses" class="qkb-bot-ui">
        <transition name="qkb-fadeUp">
            <div v-if="botActive" class="qkb-board">
                <BoardHeader :bot-title="optionsMain.botTitle" @close-bot="botToggle" />
                <BoardContent :bot-typing="botTyping" :main-data="messages" />
                <BoardAction :input-disable="inputDisable" :input-placeholder="optionsMain.inputPlaceholder"
                    :input-disable-placeholder="optionsMain.inputDisablePlaceholder" @msg-send="sendMessage" />
            </div>
        </transition>

        <div class="qkb-bot-bubble">
            <button class="qkb-bubble-btn" @click="botToggle">
                <slot name="bubbleButton">
                    <transition name="qkb-scaleUp">
                        <ChatBubbleBottomCenterTextIcon v-if="!botActive" class="h-10 w-10 mx-auto" key="1" />
                        <XMarkIcon v-else class="h-10 w-10 mx-auto" key="2" />
                    </transition>
                </slot>
            </button>
        </div>

        <AppStyle :options="optionsMain" />

        <div v-if="optionsMain.botAvatarImg" class="qkb-preload-image">
            <div class="qkb-msg-avatar__img"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useEventListener } from '@vueuse/core' // Optional utility for handling events

import EventBus from '../helpers/event-bus'
import Config from '../config'
import {
    XMarkIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
    options: {
        type: Object,
        default: () => ({})
    },
    messages: {
        type: Array,
        default: () => []
    },
    botTyping: {
        type: Boolean,
        default: false
    },
    inputDisable: {
        type: Boolean,
        default: false
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    openDelay: {
        type: Number,
        default: 0
    }
})

const botActive = ref(false)

const defaultOptions = {
    botTitle: "PESO Chatbot",
    colorScheme: '#1b53d0',
    textColor: '#fff',
    bubbleBtnSize: 56,
    animation: true,
    boardContentBg: '#fff',
    botAvatarSize: 32,
    botAvatarImg: 'http://placehold.it/200x200',
    msgBubbleBgBot: '#f0f0f0',
    msgBubbleColorBot: '#000',
    msgBubbleBgUser: '#4356e0',
    msgBubbleColorUser: '#fff',
    inputPlaceholder: 'Message',
    inputDisableBg: '#fff',
    inputDisablePlaceholder: null
}

const optionsMain = computed(() => ({ ...defaultOptions, ...props.options }))

const uiClasses = computed(() => {
    return optionsMain.value.animation ? ['qkb-bot-ui--animate'] : []
})

const botOpen = () => {
    if (!botActive.value) {
        botToggle()
    }
}

const botClose = () => {
    if (botActive.value) {
        botToggle()
    }
}

const emit = defineEmits(['init', 'destroy', 'msg-send'])

const botToggle = () => {
    botActive.value = !botActive.value

    if (botActive.value) {
        EventBus.$on('select-button-option', selectOption)
        emit('init')
    } else {
        EventBus.$off('select-button-option')
        emit('destroy')
    }
}

const sendMessage = (value) => {
    emit('msg-send', value)
}

const selectOption = (value) => {
    emit('msg-send', value)
}

onMounted(() => {
    if (props.isOpen) {
        if (props.openDelay) {
            setTimeout(botOpen, props.openDelay)
        } else {
            botToggle()
        }
    }

    // Using the VueUse library for convenience; alternatively, use standard addEventListener
    useEventListener(document, Config.EVENT_OPEN, botOpen)
    useEventListener(document, Config.EVENT_CLOSE, botClose)
    useEventListener(document, Config.EVENT_TOGGLE, botToggle)
})

onBeforeUnmount(() => {
    EventBus.$off('select-button-option')
})
</script>

<style src="../assets/scss/_app.scss" lang="scss"></style>