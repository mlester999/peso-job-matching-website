<script setup>
import { MegaphoneIcon, EnvelopeOpenIcon, UsersIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'vue3-toastify';
import { usePortalStore } from '~/store/usePortalStore';
import { messageService } from '~/helpers/message'
import BotIcon from '~/public/icons/bot.png'

const auth = useAuthStore();
const portal = usePortalStore();

const messageData = ref([])
const botTyping = ref(false)
const inputDisable = ref(false)

const statuses = [
    'Disqualified',
    'In Progress',
    'For Interview',
    'For Requirements',
    'Qualified',
    'For Deployment',
    'Deployed',
]

const botOptions = {
    botAvatarImg: BotIcon,
    boardContentBg: '#f4f4f4',
    msgBubbleBgBot: '#fff',
    inputPlaceholder: 'Type here...',
    inputDisableBg: '#fff',
    inputDisablePlaceholder: 'Hit the buttons above to respond'
}

const botStart = () => {
    // Get token if you want to build a private bot
    // Request first message here

    // Fake typing for the first message
    if (messageData.value.length === 0) {
        botTyping.value = true
        setTimeout(() => {
            botTyping.value = false
            messageData.value.push({
                agent: 'bot',
                type: 'button',
                text: 'How can we help you today?',
                options: [
                    {
                        'text': 'Know More About Us',
                        'value': 'know_more_about_us',
                        'action': 'postback'
                    },
                    {
                        'text': 'Application Status',
                        'value': 'application_status',
                        'action': 'postback'
                    }
                ],
                disableInput: true
            })
            inputDisable.value = true;
        }, 1000)
    }
}

const msgSend = (value) => {
    // Push the user's message to board
    messageData.value.push({
        agent: 'user',
        type: 'text',
        text: value.text
    })

    getResponse()
}

// Submit the message from user to bot API, then get the response from Bot
const getResponse = async () => {
    // Loading
    botTyping.value = true

    // Post the message from user here
    // Then get the response as below

    try {
        const response = await messageService.createMessage()
        const replyMessage = {
            agent: 'bot',
            ...response
        }

        if (messageData.value[messageData.value.length - 1].text === 'Know More About Us') {
            inputDisable.value = false;
            messageData.value.push({
                agent: 'bot',
                type: 'button',
                text: 'PESO is a free multi-employment service facility managed by Local Government Units (LGUs) and State Universities and Colleges (SUCs) that upholds equal employment opportunities to every individual covered in the locality. PESO aims to fill job vacancies through referral and placement, career counseling, trainings, and seminars. PESO accommodates various individuals including job seekers, employers, students, out-of-school youth, migratory workers, and persons with disabilities.',
                options: [
                    {
                        'text': 'Application Status',
                        'value': 'application_status',
                        'action': 'postback'
                    }
                ],
            })
        } else if (messageData.value[messageData.value.length - 1].text === 'Application Status') {
            inputDisable.value = false;
            messageData.value.push({
                agent: 'bot',
                type: 'button',
                text: `Your latest application is currently ${statuses[auth.user.applicant.applications[auth.user.applicant.applications.length - 1].status]}. While waiting for the result of your application, you can watch Career Guidance video which can help you to your career. Thank you!`,
                'options': [
                    {
                        'text': 'PESO Cabuyao - Career Guidance',
                        'value': 'https://www.youtube.com/watch?v=aN-OpYShP3U',
                        'action': 'url'
                    },
                    {
                        'text': 'Know More About Us',
                        'value': 'know_more_about_us',
                        'action': 'postback'
                    },

                ],
            })
        } else {
            messageData.value.push(replyMessage)
        }
    } catch (error) {
        console.error('Error fetching response:', error)
    } finally {
        // Finish
        botTyping.value = false
    }
}

onMounted(() => {
    if (portal.isUpdated) {
        toast.success(portal.toastMessage);
        portal.hideToastMessage();
    }
});

const stats = [
    { id: 1, name: 'Job Match', stat: 0, icon: UsersIcon, href: "#" },
    { id: 2, name: 'Number of Job Application', stat: auth.user.applicant.applications.length, icon: PencilSquareIcon, href: "/portal/my-applications" },
    { id: 3, name: 'Total Vacancies', stat: 0, icon: MegaphoneIcon, href: "#" },
    { id: 4, name: 'Number of Invitation', stat: 0, icon: EnvelopeOpenIcon, href: "#" },
]
</script>

<template>
    <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 mb-4">Dashboard</h2>

        <!-- <BaseBanner v-if="auth.user.applicant.applications[0].status === 0"
            :title="`Welcome, ${auth.user.applicant.first_name}`"
            description="You are now successfully a registered applicant. Your CV is under review, and in the meantime, you can update your profile if needed. Thank you and good luck." /> -->
        <dl class="my-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                            <NuxtLink :href="item.href" class="font-medium text-blue-600 hover:text-blue-500">View
                                all<span class="sr-only"> {{ item.name }} stats</span></NuxtLink>
                        </div>
                    </div>
                </dd>
            </div>
        </dl>
        <iframe class="w-full aspect-video" src="https://www.youtube.com/embed/aN-OpYShP3U" frameborder="0"
            allowfullscreen></iframe>
        <BotUI :options="botOptions" :messages="messageData" :bot-typing="botTyping" :input-disable="inputDisable"
            :is-open="false" @init="botStart" @msg-send="msgSend" />
    </div>
</template>