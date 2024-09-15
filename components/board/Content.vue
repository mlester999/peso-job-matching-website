<template>
    <div ref="boardContent" class="qkb-board-content">
        <div ref="boardBubbles" class="qkb-board-content__bubbles">
            <MessageBubbleMain v-for="(item, index) in mainData" :key="index" :message="item" />
            <div v-if="botTyping" class="qkb-board-content__bot-typing">
                <slot name="botTyping">
                    <MessageBubbleTyping />
                </slot>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
    mainData: {
        type: Array,
        required: true
    },
    botTyping: {
        type: Boolean,
        default: false
    }
})

const boardContent = ref(null)
const boardBubbles = ref(null)

const updateScroll = () => {
    const contentElm = boardContent.value
    const offsetHeight = boardBubbles.value?.offsetHeight

    if (contentElm && offsetHeight !== undefined) {
        contentElm.scrollTop = offsetHeight
    }
}

watch(() => props.mainData, () => {
    nextTick(() => {
        updateScroll()
    })
})

</script>
