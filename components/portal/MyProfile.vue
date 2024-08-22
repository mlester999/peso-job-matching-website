<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/store/useAuthStore';
import { usePortalStore } from '~/store/usePortalStore';

const auth = useAuthStore();
const portal = usePortalStore();

onMounted(() => {
    auth.fetchUser();
})

const personalInformationForm = ref({
    firstName: auth.user.applicant.first_name ?? '',
    middleName: auth.user.applicant.middle_name ?? '',
    lastName: auth.user.applicant.last_name ?? '',
    email: auth.user.email ?? '',
});

const changePasswordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
});

const logoutOtherSessionsForm = ref({
    currentPassword: ''
});

const personalInformationErrors = reactive({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
});

const changePasswordErrors = reactive({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
});

const logoutOtherSessionsErrors = reactive({
    currentPassword: ''
});

const personalInformationSubmit = async () => {
    const { error } = await portal.submitPersonalInformation(changePasswordForm.value, auth.user.applicant.id);

    if (error.value?.data?.error) {
        if (typeof error.value.data.error !== 'string') {
            if (error.value.data.error.currentPassword) {
                changePasswordErrors.currentPassword = error.value.data.error.currentPassword[0];
            } else {
                changePasswordErrors.currentPassword = '';
            }

            if (error.value.data.error.newPassword) {
                changePasswordErrors.newPassword = error.value.data.error.newPassword[0];
            } else {
                changePasswordErrors.newPassword = '';
            }

            if (error.value.data.error.confirmNewPassword) {
                changePasswordErrors.confirmNewPassword = error.value.data.error.confirmNewPassword[0];
            } else {
                changePasswordErrors.confirmNewPassword = '';
            }
        }
    } else {
        changePasswordErrors.firstName = '';
        changePasswordErrors.middleName = '';
        changePasswordErrors.lastName = '';
        changePasswordErrors.email = '';
        navigateTo('/portal');
    }
}

const changePasswordSubmit = async () => {
    const { error } = await portal.submitUpdatedPassword(changePasswordForm.value, auth.user.applicant.id);

    if (error.value?.data?.error) {
        if (typeof error.value.data.error !== 'string') {
            if (error.value.data.error.currentPassword) {
                changePasswordErrors.currentPassword = error.value.data.error.currentPassword[0];
            } else {
                changePasswordErrors.currentPassword = '';
            }

            if (error.value.data.error.newPassword) {
                changePasswordErrors.newPassword = error.value.data.error.newPassword[0];
            } else {
                changePasswordErrors.newPassword = '';
            }

            if (error.value.data.error.confirmNewPassword) {
                changePasswordErrors.confirmNewPassword = error.value.data.error.confirmNewPassword[0];
            } else {
                changePasswordErrors.confirmNewPassword = '';
            }
        }
    } else {
        changePasswordErrors.currentPassword = '';
        changePasswordErrors.newPassword = '';
        changePasswordErrors.confirmNewPassword = '';
        await auth.logout();
    }
}

const logoutOtherSessions = async () => {
    const { error } = await portal.logoutOtherSessions(logoutOtherSessionsForm.value, auth.user.applicant.id);

    if (error.value?.data?.error) {
        if (typeof error.value.data.error !== 'string') {
            if (error.value.data.error.currentPassword) {
                logoutOtherSessionsErrors.currentPassword = error.value.data.error.currentPassword[0];
            } else {
                logoutOtherSessionsErrors.currentPassword = '';
            }
        }
    } else {
        logoutOtherSessionsErrors.currentPassword = '';
        navigateTo('/portal');
    }
}
</script>

<template>
    <main>
        <h1 class="sr-only">Account Settings</h1>

        <!-- Settings forms -->
        <div class="divide-y divide-gray-900/20">
            <div class="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                    <p class="mt-1 text-sm leading-6 text-gray-600">Update your personal information associated with
                        your account.
                    </p>
                </div>

                <form @submit.prevent="personalInformationSubmit" class="md:col-span-2">
                    <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="sm:col-span-2">
                            <BaseInputField id="firstName" type="text" title="First
                                Name" v-model="personalInformationForm.firstName"
                                :errorMessage="personalInformationErrors?.firstName" />
                        </div>

                        <div class="sm:col-span-2">
                            <BaseInputField id="middleName" type="text" title="Middle
                            Name (Optional)" v-model="personalInformationForm.middleName"
                                :errorMessage="personalInformationErrors?.middleName" />
                        </div>

                        <div class="sm:col-span-2">
                            <BaseInputField id="lastName" type="text" title="Last
                            Name" v-model="personalInformationForm.lastName"
                                :errorMessage="personalInformationErrors?.lastName" />
                        </div>

                        <div class="col-span-full">
                            <BaseInputField id="email" type="text" title="Email Address"
                                v-model="personalInformationForm.email"
                                :errorMessage="personalInformationErrors?.email" />
                        </div>

                    </div>

                    <div class="mt-8 flex">
                        <button type="submit"
                            class="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">Save</button>
                    </div>
                </form>
            </div>

            <div class="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Change password</h2>
                    <p class="mt-1 text-sm leading-6 text-gray-600">Update your password associated with your account.
                    </p>
                </div>

                <form @submit.prevent="changePasswordSubmit" class="md:col-span-2">
                    <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="col-span-full">
                            <BaseInputField id="currentPassword" type="password" title="Current Password"
                                v-model="changePasswordForm.currentPassword"
                                :errorMessage="changePasswordErrors?.currentPassword" />
                        </div>

                        <div class="col-span-full">
                            <BaseInputField id="newPassword" type="password" title="New Password"
                                v-model="changePasswordForm.newPassword"
                                :errorMessage="changePasswordErrors?.newPassword" />
                        </div>

                        <div class="col-span-full">
                            <BaseInputField id="confirmNewPassword" type="password" title="Confirm New Password"
                                v-model="changePasswordForm.confirmNewPassword"
                                :errorMessage="changePasswordErrors?.confirmNewPassword" />
                        </div>
                    </div>

                    <div class="mt-8 flex">
                        <button type="submit"
                            class="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">Save</button>
                    </div>
                </form>
            </div>

            <div class="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Log out other sessions</h2>
                    <p class="mt-1 text-sm leading-6 text-gray-600">Please enter your password to confirm you would like
                        to log out of your other sessions across all of your devices.</p>
                </div>

                <form @submit.prevent="logoutOtherSessions" class="md:col-span-2">
                    <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="col-span-full">
                            <BaseInputField id="logoutCurrentPassword" type="password" title="Current Password"
                                v-model="logoutOtherSessionsForm.currentPassword"
                                :errorMessage="logoutOtherSessionsErrors?.currentPassword" />
                        </div>
                    </div>

                    <div class="mt-8 flex">
                        <button type="submit"
                            class="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">Log
                            out other sessions</button>
                    </div>
                </form>
            </div>

            <div class="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Delete account</h2>
                    <p class="mt-1 text-sm leading-6 text-gray-600">No longer want to use our service? You can delete
                        your account here. This action is not reversible. All information related to this account will
                        be deleted permanently.</p>
                </div>

                <form class="flex items-start md:col-span-2">
                    <button type="submit"
                        class="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600">Yes,
                        delete my account</button>
                </form>
            </div>
        </div>
    </main>
</template>