<template>
    <div class="qkb-msg-bubble-component qkb-msg-bubble-component--button-options">
        <div class="qkb-msg-bubble-component__text">{{ mainData.text }}</div>
        <div class="qkb-msg-bubble-component__options-wrapper">
            <div class="qkb-mb-button-options__item" v-for="(item, index) in mainData.options" :key="index"
                :class="{ active: selectedItem === item.value }">
                <button v-if="item.action === 'postback'" class="qkb-mb-button-options__btn"
                    @click="selectOption(item)">
                    <span>{{ item.text }}</span>
                </button>
                <a v-else class="qkb-mb-button-options__btn qkb-mb-button-options__url" :href="item.value"
                    target="_blank">
                    <span>{{ item.text }}</span>
                </a>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import EventBus from '../../helpers/event-bus'

const props = defineProps({
    mainData: {
        type: Object,
        required: true
    }
})

const selectedItem = ref(null)

const selectOption = (item) => {
    selectedItem.value = item
    EventBus.$emit('select-button-option', item)
}
</script>