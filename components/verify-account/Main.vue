<script setup>
import { useHead } from 'nuxt/app';
import { onMounted, onBeforeUnmount } from 'vue';
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';
import {
    EnvelopeIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/vue/24/outline'
import { REGEXP_ONLY_DIGITS } from 'vue-input-otp';
import { cn } from '@/lib/utils'

const auth = useAuthStore();
const inputSms = ref('')
const isEmailSelected = ref(false);
const isSmsSelected = ref(false);

const isInputSmsError = ref(false);

const otp = ref('');

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    password: '',
    password_confirmation: '',
});

const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    password: '',
    password_confirmation: '',
});

const selectEmail = () => {
    isEmailSelected.value = true;
}

const selectSms = async () => {
    const smsResponse = await auth.verifyUsingSms(auth.user.applicant.id);
    isSmsSelected.value = true;
    otp.value = smsResponse.code;
}

const submitOtp = () => {
    if (otp.value != inputSms.value) {
        isInputSmsError.value = true;
    } else {
        isInputSmsError.value = false;
        return auth.verifyContactNumber(auth.user.applicant.id);
    }
}
</script>

<template>
    <div class="sm:mx-auto sm:w-full sm:max-w-md mt-24">
        <img class="mx-auto h-20 w-auto" src="/public/peso_icon_no_bg.png" alt="Your Company" />
        <div v-if="!isEmailSelected && !isSmsSelected">
            <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Verify Your Account
            </h2>
            <p class="mt-6 text-center">To ensure the security of your account, we offer two convenient verification
                methods. You can
                choose to
                verify your identity either via Email or SMS.</p>
        </div>
        <div v-else-if="isSmsSelected">
            <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Verify Your Account
                using SMS
            </h2>
            <p class="mt-6 text-center">Enter the 6 digit verification code received on +63{{
                auth.user.applicant.contact_number }}</p>
        </div>
    </div>

    <div v-if="!isEmailSelected && !isSmsSelected" class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12 space-y-6">
            <div>
                <button @click="selectEmail" type="button"
                    class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Verify
                    using Email
                    <EnvelopeIcon class="ml-1 h-6 w-6" aria-hidden="true" />
                </button>
            </div>

            <div>
                <button @click="selectSms" type="button"
                    class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Verify
                    using SMS
                    <ChatBubbleBottomCenterTextIcon class="ml-1 h-6 w-6" aria-hidden="true" />
                </button>
            </div>
        </div>
    </div>

    <div v-else-if="isSmsSelected" class="mt-10 sm:mx-auto sm:w-max">
        <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12 space-y-6">
            <form :class="cn('mx-auto max-w-[980px] justify-center pt-6 pb-4 space-y-4')" @submit="onSubmit">
                <OTPInput class="focus:outline-none focus:ring-0" ref="inputRef" v-slot="{ slots, isFocused }"
                    v-model="inputSms" :disabled="disabled" :maxlength="6" :pattern="REGEXP_ONLY_DIGITS"
                    container-class="group flex items-center">
                    <div class="flex">
                        <BaseSlot v-for="(slot, idx) in slots.slice(0, 3)" :key="idx" :is-focused="isFocused"
                            :animate-idx="idx" v-bind="slot" :hasError="isInputSmsError" />
                    </div>

                    <!-- Layout inspired by Stripe -->
                    <div class="flex w-10 md:20 justify-center items-center">
                        <div class="w-3 md:w-6 h-1 md:h-2 rounded-full bg-border bg-gray-500" />
                    </div>

                    <div class="flex">
                        <BaseSlot v-for="(slot, idx) in slots.slice(3)" :key="idx" :is-focused="isFocused" v-bind="slot"
                            :hasError="isInputSmsError" />
                    </div>
                </OTPInput>
                <p class="text-red-600 text-center" v-if="isInputSmsError">The OTP you entered is incorrect. Please try
                    again.</p>
                <button @click="submitOtp" type="button"
                    class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Submit
                    OTP
                </button>
            </form>
        </div>
    </div>
</template>