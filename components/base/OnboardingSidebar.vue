<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '~/store/useAuthStore';
import { useOnboardingStore } from '~/store/useOnboardingStore';

const auth = useAuthStore();
const onboarding = useOnboardingStore();

onBeforeMount(() => {
    if (auth.user.applicant.education) {
        if (auth.user.applicant.work_experience) {
            if (auth.user.applicant.skills) {
                onboarding.updateCurrentPage(5);
                onboarding.checkCurrentProgress(5);
            } else {
                onboarding.updateCurrentPage(4);
                onboarding.checkCurrentProgress(4);
            }
        } else {
            onboarding.updateCurrentPage(3);
            onboarding.checkCurrentProgress(3);
        }
    } else {
        if (auth.user.applicant.zip_code) {
            onboarding.updateCurrentPage(2);
            onboarding.checkCurrentProgress(2);
        } else {
            onboarding.updateCurrentPage(1);
            onboarding.checkCurrentProgress(1);
        }
    }
})

const steps = [
    { name: 'Personal Information', page: 1, status: 'current' },
    { name: 'Educational Background', page: 2, status: 'upcoming' },
    { name: 'Work Experience', page: 3, status: 'upcoming' },
    { name: 'Skills & Profession', page: 4, status: 'upcoming' },
    { name: 'Confirmation', page: 5, status: 'upcoming' },
]
</script>

<template>
    <div class="flex grow flex-col gap-y-4 overflow-y-auto border-r border-gray-200 px-6 bg-white">
        <div class="flex h-40 shrink-0 items-center justify-center my-4">
            <img class="h-32 w-auto" src="/public/peso_icon_no_bg.png" alt="Your Company" />
        </div>
        <nav aria-label="Progress">
            <ol role="list" class="overflow-hidden">
                <li v-for="(step, stepIdx) in steps" :key="step.name"
                    :class="[stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative']">
                    <template v-if="onboarding.currentProgress > step.page">
                        <div v-if="stepIdx !== steps.length - 1"
                            class="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-indigo-600" aria-hidden="true" />
                        <div v-else class="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                            aria-hidden="true" />
                        <button @click="onboarding.updateCurrentPage(step.page)" type="button"
                            class="group relative flex items-center">
                            <span class=" flex h-9 items-center">
                                <span
                                    class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                                    <CheckIcon class="h-5 w-5 text-white" aria-hidden="true" />
                                </span>
                            </span>
                            <span v-if="onboarding.currentPage === step.page" class="flex flex-col mx-auto">
                                <span class="text-xl font-medium text-indigo-600 mx-8">{{ step.name }}</span>
                            </span>
                            <span v-else class="flex flex-col mx-auto">
                                <span class="text-xl font-medium mx-8">{{ step.name }}</span>
                            </span>
                        </button>
                    </template>
                    <template v-else-if="onboarding.currentPage === step.page">
                        <div v-if="stepIdx !== steps.length - 1"
                            class="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300" aria-hidden="true" />
                        <button @click="onboarding.updateCurrentPage(step.page)" type="button"
                            class="group relative flex items-center">
                            <span class="flex h-9 items-center" aria-hidden="true">
                                <span
                                    class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                                    <span class="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                                </span>
                            </span>
                            <span class="flex flex-col mx-auto">
                                <span class="text-xl font-medium text-indigo-600 mx-8">{{ step.name }}</span>
                            </span>
                        </button>
                    </template>
                    <template v-else>
                        <div v-if="stepIdx !== steps.length - 1"
                            class="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300" aria-hidden="true" />
                        <button @click="onboarding.updateCurrentPage(step.page)" type="button"
                            class="group relative flex items-center" :disabled="onboarding.currentProgress < step.page">
                            <span class="flex h-9 items-center" aria-hidden="true">
                                <span v-if="onboarding.currentProgress < step.page"
                                    class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                                    <span class="h-2.5 w-2.5 rounded-full bg-transparent" />
                                </span>
                                <span v-else
                                    class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                                    <span class="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                                </span>
                            </span>
                            <span v-if="onboarding.currentProgress < step.page" class="flex flex-col mx-auto">
                                <span class="text-xl font-medium text-gray-400 mx-8">{{ step.name }}</span>
                            </span>
                            <span v-else class="flex flex-col mx-auto">
                                <span class="text-xl font-medium text-gray-600 mx-8">{{ step.name }}</span>
                            </span>
                        </button>
                    </template>
                </li>
            </ol>
        </nav>
    </div>
</template>