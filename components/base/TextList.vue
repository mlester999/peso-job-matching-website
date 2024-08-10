<script setup>
import { computed } from 'vue';

const props = defineProps({
    data: Object,
    title: String
})

// Computed property to capitalize the first letter of the title
const capitalizedTitle = (title) => {
    return title.charAt(0).toUpperCase() + title.slice(1);
};
</script>

<template>
    <div class="lg:col-start-3 lg:row-end-1 h-full pb-8">
        <div class="bg-gray-50 shadow-sm ring-1 ring-gray-900/5 h-full">

            <div class="border-t border-gray-900/5 px-6 py-6 space-y-2">
                <ol v-for="(info, index) in data" :key="index"
                    class="list-disc text-sm font-medium leading-6 text-gray-900 ml-4">
                    <li>{{ capitalizedTitle(info) }}</li>
                    <!-- ... -->
                </ol>

                <ol v-if="data.length === 0" class="list-disc text-sm font-medium leading-6 text-gray-900 ml-4">
                    <li>No {{ title }} found.</li>
                </ol>
            </div>
        </div>
    </div>
</template>
