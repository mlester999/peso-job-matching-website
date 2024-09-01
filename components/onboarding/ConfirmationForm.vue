<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/store/useAuthStore';
import { useOnboardingStore } from '~/store/useOnboardingStore';

const auth = useAuthStore();
const onboarding = useOnboardingStore();

onMounted(() => {
    auth.fetchUser();
})

const handleSubmit = async () => {
    await onboarding.confirmOnboarding(auth.user.applicant.id);
};


</script>

<template>
    <form @submit.prevent="handleSubmit" class="col-span-3 m-24">
        <div class="space-y-12">
            <div class="pb-12">
                <h2 class="text-2xl font-bold leading-7 text-gray-900">Confirmation</h2>

                <div class="bg-transparent py-8">
                    <div class="relative isolate">
                        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div
                                class="mx-auto flex max-w-2xl flex-col gap-16 bg-white/5 px-6 py-16 ring-1 ring-white/10 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20">
                                <img class="h-96 w-full flex-none rounded-2xl lg:h-auto lg:max-w-sm"
                                    src="/public/confirmation_1.png" alt="" />
                                <div class="w-full flex-auto">
                                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">You're
                                        Almost There!
                                    </h2>
                                    <p class="mt-6 text-lg leading-8 text-gray-800">Thank you for completing your
                                        onboarding. Your profile is now ready to be matched with potential employers. If
                                        you're confident with the
                                        information
                                        you've provided and are ready to move forward, click the "Confirm" button below.
                                    </p>
                                    <div class="mt-6 w-full items-center justify-center">
                                        <button type="submit"
                                            class="rounded-md w-full bg-blue-600 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
                            aria-hidden="true">
                            <div class="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
                                style="clip-path: polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)" />
                        </div>
                    </div>
                </div>
            </div>


        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">

        </div>
    </form>
</template>