<template>
    <div class="qkb-msg-bubble-component qkb-msg-bubble-component--single-text">
        <div class="qkb-msg-bubble-component__text">
            {{ mainData.text }}
        </div>
    </div>
</template>


<script setup>
const props = defineProps({
    mainData: {
        type: Object,
        required: true
    }
})
</script>