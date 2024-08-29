<script setup>
import { ref, reactive, computed } from 'vue';
import { useAuthStore } from '~/store/useAuthStore';
import { usePortalStore } from '~/store/usePortalStore';
import { ArrowDownCircleIcon, ArrowPathIcon, ArrowUpCircleIcon } from '@heroicons/vue/20/solid'
import { format, isToday, isYesterday, parseISO } from 'date-fns'

const route = useRoute();

const statuses = [
    'text-blue-600 bg-blue-50 ring-blue-500/10',
    'text-orange-600 bg-orange-50 ring-orange-500/10',
    'text-yellow-700 bg-yellow-50 ring-yellow-600/20',
    'text-green-700 bg-green-50 ring-green-600/20',
    'text-red-700 bg-red-50 ring-red-600/10',
]

const days = [
    {
        date: 'Today',
        dateTime: '2023-03-22',
        transactions: [
            {
                id: 1,
                invoiceNumber: '00012',
                href: '#',
                amount: '$7,600.00 USD',
                tax: '$500.00',
                status: 'Paid',
                client: 'Reform',
                description: 'Website redesign',
            },
            {
                id: 2,
                invoiceNumber: '00011',
                href: '#',
                amount: '$10,000.00 USD',
                status: 'Withdraw',
                client: 'Tom Cook',
                description: 'Salary',
            },
            {
                id: 3,
                invoiceNumber: '00009',
                href: '#',
                amount: '$2,000.00 USD',
                tax: '$130.00',
                status: 'Overdue',
                client: 'Tuple',
                description: 'Logo design',
            },
        ],
    },
    {
        date: 'Yesterday',
        dateTime: '2023-03-21',
        transactions: [
            {
                id: 4,
                invoiceNumber: '00010',
                href: '#',
                amount: '$14,000.00 USD',
                tax: '$900.00',
                status: 'Paid',
                client: 'SavvyCal',
                description: 'Website redesign',
            },
        ],
    },
]

const auth = useAuthStore();

const application = auth.user.applicant.applications.find((el) => {
    return el.id === Number(route.params.id)
})

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

onMounted(() => {
    auth.fetchUser();
})

</script>

<template>
    <div>
        <OnboardingPersonalInformationForm :isFromDashboard="true" />

        <OnboardingEducationalBackgroundForm :isFromDashboard="true" />

        <OnboardingWorkExperienceForm :isFromDashboard="true" />

        <OnboardingSkillsAndProfessionForm :isFromDashboard="true" />
    </div>
</template>