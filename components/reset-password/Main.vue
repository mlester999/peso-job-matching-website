<script setup>
import { useHead } from 'nuxt/app';
import { onMounted, onBeforeUnmount } from 'vue';
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';

const auth = useAuthStore();

const route = useRoute();


onMounted(() => {
    if (route.query.token) {
        auth.fetchResetPasswordEmail(route.query.token);
    } else {
        navigateTo('forgot-password');
    }

    const nuxtDiv = document.getElementById('__nuxt');
    if (nuxtDiv) {
        nuxtDiv.classList.add('flex');
        nuxtDiv.classList.add('min-h-full');
        nuxtDiv.classList.add('flex-1');
        nuxtDiv.classList.add('flex-col');
        nuxtDiv.classList.add('justify-center');
        nuxtDiv.classList.add('py-12');
        nuxtDiv.classList.add('sm:px-6');
        nuxtDiv.classList.add('lg:px-8');
    }
});

onBeforeUnmount(() => {
    const nuxtDiv = document.getElementById('__nuxt');
    if (nuxtDiv) {
        nuxtDiv.classList.remove('flex');
        nuxtDiv.classList.remove('min-h-full');
        nuxtDiv.classList.remove('flex-1');
        nuxtDiv.classList.remove('flex-col');
        nuxtDiv.classList.remove('justify-center');
        nuxtDiv.classList.remove('py-12');
        nuxtDiv.classList.remove('sm:px-6');
        nuxtDiv.classList.remove('lg:px-8');
    }
});

useHead({
    htmlAttrs: {
        class: 'h-full bg-gray-50'
    },
    bodyAttrs: {
        class: 'h-full'
    }
});



const form = ref({
    email: ''
});

const errors = reactive({
    email: ''
});

const successMessage = ref('');

const handleResetPassword = async () => {
    const { error } = await auth.sendResetPasswordLink(form.value);
    if (error.value?.data?.error) {
        if (typeof error.value.data.error !== 'string') {
            if (error.value.data.error.email) {
                errors.email = error.value.data.error.email[0];
            } else {
                errors.email = '';
            }
        } else {
            errors.email = error.value.data.error;
        }
    } else {
        errors.email = '';
        successMessage.value = 'An email has been sent to your email address. Follow the instructions on how to reset your password.'
    }
};
</script>

<template>
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img class="mx-auto h-20 w-auto" src="/public/peso_icon_no_bg.png" alt="Your Company" />
        <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Reset password
        </h2>
        <p class="mt-6 text-center">Enter your email address and we will send you the recovery code to reset your
            password.</p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form class="space-y-6" @submit.prevent="handleForgotPassword">
                <div>
                    <BaseInputField id="email" v-model="form.email" title="Email Address" type="email"
                        :errorMessage="errors?.email" />
                    <p class="text-green-600 text-sm mt-1" v-if="successMessage">{{ successMessage }}</p>
                </div>

                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Submit</button>
                </div>
            </form>


        </div>

        <p class="mt-10 text-center text-sm text-gray-500">
            Already a member?
            {{ ' ' }}
            <NuxtLink href="/login" class="font-semibold leading-6 text-blue-600 hover:text-blue-500">Back to login
            </NuxtLink>
        </p>
    </div>
</template>