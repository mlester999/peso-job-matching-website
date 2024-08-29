<script setup>
import { ref, reactive, computed } from 'vue';
import { useAuthStore } from '~/store/useAuthStore';
import { usePortalStore } from '~/store/usePortalStore';
import { ArrowDownCircleIcon, ArrowPathIcon, ArrowUpCircleIcon } from '@heroicons/vue/20/solid'
import { format, isToday, isYesterday, parseISO } from 'date-fns'

onMounted(() => {
    auth.fetchUser();
})

const statuses = [
    'text-blue-600 bg-blue-50 ring-blue-500/10',
    'text-orange-600 bg-orange-50 ring-orange-500/10',
    'text-yellow-700 bg-yellow-50 ring-yellow-600/20',
    'text-green-700 bg-green-50 ring-green-600/20',
    'text-red-700 bg-red-50 ring-red-600/10',
]

const auth = useAuthStore();

const formatDate = (date) => {
    const parsedDate = parseISO(date);
    if (isToday(parsedDate)) {
        return 'Today';
    } else if (isYesterday(parsedDate)) {
        return 'Yesterday';
    } else {
        return format(parsedDate, 'MMMM d, yyyy'); // e.g., August 26, 2024
    }
}

// Computed property to group applications by formatted date
const groupedApplications = computed(() => {
    const groups = {};

    auth.user.applicant.applications.forEach((application) => {
        const formattedDate = formatDate(application.created_at);
        if (!groups[formattedDate]) {
            groups[formattedDate] = [];
        }
        groups[formattedDate].push(application);
    });

    return groups;
});
console.log(groupedApplications.value);
</script>

<template>
    <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 mb-4">My Applications</h2>
        <div class="mt-6 overflow-hidden border-t border-gray-100 bg-white">
            <div class="max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                    <table class="w-full text-left">
                        <tbody>
                            <template v-for="(applications, date) in groupedApplications" :key="date">
                                <tr class="text-sm leading-6 text-gray-900">
                                    <th scope="colgroup" colspan="3" class="relative isolate py-2 font-semibold">
                                        <time :datetime="date">{{ date
                                            }}</time>
                                        <div
                                            class="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 bg-gray-100" />
                                        <div
                                            class="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 bg-gray-100" />
                                    </th>
                                </tr>
                                <tr v-for="application in applications" :key="application.id">
                                    <td class="relative py-5 pr-6">
                                        <div class="flex gap-x-6">
                                            <div class="flex-auto">
                                                <div class="flex items-start gap-x-3">
                                                    <div class="text-sm font-medium leading-6 text-gray-900">{{
                                                        JSON.parse(application.skills).jobPositionTitle }}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                                        <div class="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                                    </td>
                                    <td class="hidden py-5 pr-6 sm:table-cell">
                                        <div class="flex items-start gap-x-3">
                                            <div
                                                :class="[statuses[application.status], 'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset']">
                                                On Process</div>
                                        </div>

                                    </td>
                                    <td class="py-5 text-right">
                                        <div class="flex justify-end">
                                            <NuxtLink :href="`/portal/my-applications/${application.id}`"
                                                class="text-sm font-medium leading-6 text-blue-600 hover:text-blue-500">
                                                View<span class="hidden sm:inline"> application</span></NuxtLink>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>