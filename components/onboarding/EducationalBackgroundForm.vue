<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/store/useAuthStore';
import { useOnboardingStore } from '~/store/useOnboardingStore';

const auth = useAuthStore();
const onboarding = useOnboardingStore();

onMounted(() => {
    auth.fetchUser();
})

const form = ref({
    schoolName: '',
    educationalLevel: '',
    startDate: '',
    endDate: '',
    honorsReceived: ''
});

const errors = reactive({
    schoolName: '',
    educationalLevel: '',
    startDate: '',
    endDate: '',
    honorsReceived: ''
});

const handleSubmit = async () => {
    const { error } = await onboarding.submitPersonalInformation(form.value, auth.user.applicant.id);

    if (error.value?.data?.error) {
        if (typeof error.value.data.error !== 'string') {
            if (error.value.data.error.firstName) {
                errors.firstName = error.value.data.error.firstName[0];
            } else {
                errors.firstName = '';
            }

            if (error.value.data.error.middleName) {
                errors.middleName = error.value.data.error.middleName[0];
            } else {
                errors.middleName = '';
            }
        }
    } else {
        errors.firstName = '';
        onboarding.currentPage(3);
    }
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="col-span-3 m-24">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-2xl font-bold leading-7 text-gray-900">Educational Background</h2>

                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div class="sm:col-span-2">
                        <BaseInputField id="firstName" title="First Name" v-model="form.firstName" type="text"
                            :errorMessage="errors?.firstName" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="middleName" title="Middle Name (Optional)" v-model="form.middleName"
                            type="text" :errorMessage="errors?.middleName" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="lastName" title="Last Name" v-model="form.lastName" type="text"
                            :errorMessage="errors?.lastName" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="email" title="Email Address" v-model="form.email" type="text"
                            :errorMessage="errors?.email" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="birthDate" title="Birth Date" v-model="form.birthDate" type="date"
                            :errorMessage="errors?.birthDate" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseSelectField id="sex" title="Sex" v-model="form.sex" type="text"
                            :errorMessage="errors?.sex">
                            <option value="" disabled selected hidden>~ Select a sex ~</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </BaseSelectField>
                    </div>

                    <div class="sm:col-span-2">
                        <BaseSelectField id="province" title="Province" v-model="form.province" type="text"
                            :errorMessage="errors?.province">
                            <option value="Laguna">Laguna</option>
                        </BaseSelectField>
                    </div>

                    <div class="sm:col-span-2">
                        <BaseSelectField id="city" title="City" v-model="form.city" type="text"
                            :errorMessage="errors?.city">
                            <option value="Cabuyao">Cabuyao</option>
                        </BaseSelectField>
                    </div>

                    <div class="sm:col-span-2">
                        <BaseSelectField id="barangay" title="Barangay" v-model="form.barangay" type="text"
                            :errorMessage="errors?.barangay">
                            <option value="" disabled selected hidden>~ Select Barangay ~</option>
                            <option v-for="(barangay, index) in barangays" :key="index">
                                {{ barangay }}
                            </option>
                        </BaseSelectField>
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="streetAddress" title="Street Address" v-model="form.streetAddress"
                            type="text" :errorMessage="errors?.streetAddress" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="zipCode" title="Zip Code" v-model="form.zipCode" type="text"
                            :errorMessage="errors?.zipCode" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="contactNumber" title="Contact Number" v-model="form.contactNumber"
                            type="text" :errorMessage="errors?.contactNumber" />
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="submit"
                class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Next</button>
        </div>
    </form>
</template>