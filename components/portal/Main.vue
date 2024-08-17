<script setup>
import { MegaphoneIcon, EnvelopeOpenIcon, UsersIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'vue3-toastify';
import { usePortalStore } from '~/store/usePortalStore';

const auth = useAuthStore();
const portal = usePortalStore();

onMounted(() => {
    if (portal.isUpdated) {
        toast.success(portal.toastMessage);
        portal.hideToastMessage();
    }
});

const stats = [
    { id: 1, name: 'Job Match', stat: 0, icon: UsersIcon },
    { id: 2, name: 'Number of Job Application', stat: auth.user.applicant.applications.length, icon: PencilSquareIcon },
    { id: 3, name: 'Total Vacancies', stat: 0, icon: MegaphoneIcon },
    { id: 4, name: 'Number of Invitation', stat: 0, icon: EnvelopeOpenIcon },
]
</script>

<template>
    <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 mb-4">Dashboard</h2>

        <BaseBanner v-if="auth.user.applicant.applications[0].status === 0"
            :title="`Welcome, ${auth.user.applicant.first_name}`"
            description="You are now successfully registered to the Job Portal. Your CV is under review, and in the meantime, you can wait or update your profile if needed. Thank you and good luck." />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="item in stats" :key="item.id"
                class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
                <dt>
                    <div class="absolute rounded-md bg-blue-500 p-3">
                        <component :is="item.icon" class="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p class="ml-16 truncate text-sm font-medium text-gray-500">{{ item.name }}</p>
                </dt>
                <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
                    <p class="text-2xl font-semibold text-gray-900">{{ item.stat }}</p>
                    <div class="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                        <div class="text-sm">
                            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">View all<span
                                    class="sr-only"> {{ item.name }} stats</span></a>
                        </div>
                    </div>
                </dd>
            </div>
        </dl>
    </div>
</template>