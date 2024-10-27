<script setup>
import { useHead } from 'nuxt/app';
import { onMounted, onBeforeUnmount } from 'vue';
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';

onMounted(() => {
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

const auth = useAuthStore();

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    contact_number: '',
    password: '',
    password_confirmation: '',
});

const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    contact_number: '',
    password: '',
    password_confirmation: '',
});

const handleRegister = async () => {
    const { error } = await auth.register(form.value);

    if (error.value?.data?.error) {
        if (typeof error.value.data.error !== 'string') {
            if (error.value.data.error.firstName) {
                errors.firstName = error.value.data.error.firstName[0];
            } else {
                errors.firstName = '';
            }

            if (error.value.data.error.lastName) {
                errors.lastName = error.value.data.error.lastName[0];
            } else {
                errors.lastName = '';
            }

            if (error.value.data.error.email) {
                errors.email = error.value.data.error.email[0];
            } else {
                errors.email = '';
            }

            if (error.value.data.error.contact_number) {
                errors.contact_number = error.value.data.error.contact_number[0];
            } else {
                errors.contact_number = '';
            }

            if (error.value.data.error.password) {
                errors.password = error.value.data.error.password[0];
            } else {
                errors.password = '';
            }

            if (error.value.data.error.password_confirmation) {
                errors.password_confirmation =
                    error.value.data.error.password_confirmation[0];
            } else {
                errors.password_confirmation = '';
            }
        }
    } else {
        errors.firstName = '';
        errors.lastName = '';
        errors.email = '';
        errors.contact_number = '';
        errors.password = '';
        errors.password_confirmation = '';
    }
};
</script>

<template>
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img class="mx-auto h-20 w-auto" src="/public/peso_icon_no_bg.png" alt="Your Company" />
        <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register your account
        </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form class="space-y-6" @submit.prevent="handleRegister">
                <div>
                    <BaseInputField id="firstName" v-model="form.firstName" title="First Name" type="text"
                        :errorMessage="errors?.firstName" />
                </div>

                <div>
                    <BaseInputField id="lastName" v-model="form.lastName" title="Last Name" type="text"
                        :errorMessage="errors?.lastName" />
                </div>

                <div>
                    <BaseInputField id="email" v-model="form.email" title="Email Address" type="email"
                        :errorMessage="errors?.email" />
                </div>

                <div>
                    <BaseInputField id="contact_number" v-model="form.contact_number" title="Contact Number" type="text"
                        :errorMessage="errors?.contact_number" :isContactNumber="true" />
                </div>

                <div>
                    <BaseInputField id="password" v-model="form.password" title="Password" type="password"
                        :errorMessage="errors?.password" />
                </div>

                <div>
                    <BaseInputField id="passwordConfirmation" v-model="form.password_confirmation"
                        title="Confirm Password" type="password" :errorMessage="errors?.password_confirmation" />
                </div>

                <div>
                    <button :disabled="auth.isLoading" type="submit"
                        class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        :class="[
                            auth.isLoading
                                ? 'bg-gradient-to-r from-[#85a5ff] to-[#4b8dff] hover:shadow-none'
                                : 'bg-gradient-to-r from-[#468ef9] to-[#0c66ee]',
                        ]">{{
                            auth.isLoading ? 'Loading...' : 'Create Account' }}</button>
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