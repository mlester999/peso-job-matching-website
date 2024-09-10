<script setup>
import { formatDistanceToNow } from "date-fns";

const props = defineProps({
    notifications: Array,
});

const isShowModal = ref(false);
const modalTitle = ref('');
const modalDescription = ref('');

const showDetailedNotification = (notification) => {
    isShowModal.value = true;
    modalTitle.value = notification.title;
    modalDescription.value = notification.description;
}

const handleCloseModal = () => {
    isShowModal.value = false;
    modalTitle.value = '';
    modalDescription.value = '';
}
</script>

<template>
    <div class="max-h-[600px] overflow-y-auto">
        <div v-for="notification in notifications.slice().reverse().slice(0, 5)" :key="notification.id"
            @click="showDetailedNotification(notification)"
            class="flex px-4 py-3 border-b border-gray-300 hover:bg-gray-100 cursor-pointer">
            <!-- <div class="flex-shrink-0">
                <img
                    class="rounded-full w-11 h-11"
                    src="/images/avatar.png"
                    alt="User Avatar"
                />
            </div> -->
            <div class="w-full pl-3">
                <div class="text-gray-700 font-normal text-sm mb-1.5 dark:text-gray-200">
                    {{ notification.title }}
                </div>
                <div class="text-xs font-medium text-primary-700 dark:text-primary-400">
                    {{ formatDistanceToNow(new Date(notification.created_at)) }}
                    ago
                </div>
            </div>
        </div>
    </div>
    <BaseModal v-if="isShowModal" :title="modalTitle" :description="modalDescription" :onClose="handleCloseModal" />
</template>
