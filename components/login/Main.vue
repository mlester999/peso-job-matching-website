<script setup>
import { useHead } from 'nuxt/app';
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';
import { usePortalStore } from '~/store/usePortalStore';
import { toast } from 'vue3-toastify';

const portal = usePortalStore();

onMounted(() => {
    const nuxtDiv = document.getElementById('__nuxt');
    if (nuxtDiv) {
        nuxtDiv.classList.add('flex');
        nuxtDiv.classList.add('min-h-full');
        nuxtDiv.classList.add('flex-1');
    }

    if (portal.isUpdated) {
        toast.info(portal.toastMessage);
        portal.hideToastMessage();
    }
});

onBeforeUnmount(() => {
    const nuxtDiv = document.getElementById('__nuxt');
    if (nuxtDiv) {
        nuxtDiv.classList.remove('flex');
        nuxtDiv.classList.remove('min-h-full');
        nuxtDiv.classList.remove('flex-1');
    }
});

useHead({
    htmlAttrs: {
        class: 'h-full bg-white'
    },
    bodyAttrs: {
        class: 'h-full'
    }
});

const auth = useAuthStore();

const form = ref({
    email: '',
    password: '',
});

const errors = reactive({
    email: '',
    password: '',
});

const handleLogin = async () => {
    const { error } = await auth.login(form.value);

    if (error.value?.data?.error) {
        if (typeof error.value.data.error !== 'string') {
            if (error.value.data.error.email) {
                errors.email = error.value.data.error.email[0];
            }

            if (error.value.data.error.password) {
                errors.password = error.value.data.error.password[0];
            }
        } else {
            errors.email = error.value.data.error;
            errors.password = '';
        }
    } else {
        errors.email = '';
        errors.password = '';
    }
};
</script>

<template>
    <div class="relative hidden w-0 flex-1 lg:block">
        <img class="absolute inset-0 h-full w-full object-cover" src="/public/cover_photo_2.jpg" alt="" />
    </div>
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div class="mx-auto w-full max-w-sm lg:w-96">
            <div>
                <div class="flex">
                    <NuxtLink href="/">
                        <img class="h-20 w-auto" src="/public/peso_icon_no_bg.png" alt="PESO Icon" />
                    </NuxtLink>
                </div>
                <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account
                </h2>
                <p class="mt-2 text-sm leading-6 text-gray-500">
                    Not a member?
                    {{ ' ' }}
                    <NuxtLink href="/register" class="font-semibold text-blue-600 hover:text-blue-500">Create a new
                        account</NuxtLink>
                </p>
            </div>

            <div class="mt-10">
                <div>
                    <form class="space-y-6" @submit.prevent="handleLogin">
                        <div>
                            <BaseInputField id="email" v-model="form.email" title="Email Address" type="email"
                                :errorMessage="errors?.email" />
                        </div>

                        <div>
                            <BaseInputField id="password" v-model="form.password" title="Password" type="password"
                                :errorMessage="errors?.password" />
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox"
                                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                                <label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-700">Remember
                                    me</label>
                            </div>

                            <div class="text-sm leading-6">
                                <NuxtLink href="/forgot-password"
                                    class="font-semibold text-blue-600 hover:text-blue-500">Forgot
                                    password?</NuxtLink>
                            </div>
                        </div>

                        <div>
                            <BaseButton :disabled="auth.isLoading" type="submit" :class="[
                                auth.isLoading
                                    ? 'bg-gradient-to-r from-[#85a5ff] to-[#4b8dff] hover:shadow-none'
                                    : 'bg-gradient-to-r from-[#468ef9] to-[#0c66ee]',
                            ]">
                                {{ auth.isLoading ? 'Loading...' : 'Sign In' }}
                            </BaseButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>