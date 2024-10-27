<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useAuthStore } from '~/store/useAuthStore';
import { useOnboardingStore } from '~/store/useOnboardingStore';
import { employmentTypes } from '~/utils/employmentTypes';
import { industries } from '~/utils/industries';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxLabel,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/vue'
import { toast } from 'vue3-toastify';


const props = defineProps({
    isFromDashboard: Boolean,
    isCreate: Boolean,
    application: Object
})


const auth = useAuthStore();
const { applications } = auth.user.applicant;
const onboarding = useOnboardingStore();

onMounted(() => {
    auth.fetchUser();
})

const form = ref(props.isCreate
    ? applications[applications.length - 1].is_draft
        ? JSON.parse(applications[applications.length - 1].list_of_credentials) ?? [
            {
                certificationName: '',
                certifyingAgency: '',
                dateOfObtainment: '',
                location: '',
            }
        ]
        : [
            {
                certificationName: '',
                certifyingAgency: '',
                dateOfObtainment: '',
                location: '',
            }
        ]
    : props.application ? JSON.parse(props.application.list_of_credentials) : JSON.parse(applications[0].list_of_credentials) ?? [
        {
            certificationName: '',
            certifyingAgency: '',
            dateOfObtainment: '',
            location: '',
        }
    ]
)

// Computed property that generates the array based on list_of_credentials length
const errorsWithData = computed(() => {
    return Array.from({
        length: props.isCreate
            ? applications[applications.length - 1].is_draft
                ? JSON.parse(applications[applications.length - 1].list_of_credentials)?.length
                : 0
            : props.application ? JSON.parse(props.application.list_of_credentials)?.length : JSON.parse(applications[0].list_of_credentials)?.length ?? 0
    }, () => ({
        certificationName: '',
        certifyingAgency: '',
        dateOfObtainment: '',
        location: '',
    }));
});

const errors = ref(errorsWithData.value.length > 0 ? errorsWithData.value : [
    {
        certificationName: '',
        certifyingAgency: '',
        dateOfObtainment: '',
        location: '',
    }
]);

const addField = () => {
    form.value.push({
        certificationName: '',
        certifyingAgency: '',
        dateOfObtainment: '',
        location: '',
    })
    errors.value.push({
        certificationName: '',
        certifyingAgency: '',
        dateOfObtainment: '',
        location: '',
    })
}

const removeField = (index) => {
    form.value.splice(index, 1)
    errors.value.splice(index, 1)
}

const handleSubmit = async () => {
    const { error } = await onboarding.submitListOfCredentials(form.value, auth.user.applicant.id, props.application);

    if (error.value?.data?.error) {
        if (typeof error.value.data.error !== 'string') {
            errors.value.forEach((err, index) => {
                if (error.value.data.error[`${index}.certificationName`]) {
                    errors.value[index].certificationName = error.value.data.error[`${index}.certificationName`][0];
                } else {
                    errors.value[index].certificationName = '';
                }

                if (error.value.data.error[`${index}.certifyingAgency`]) {
                    errors.value[index].certifyingAgency = error.value.data.error[`${index}.certifyingAgency`][0];
                } else {
                    errors.value[index].certifyingAgency = '';
                }

                if (error.value.data.error[`${index}.dateOfObtainment`]) {
                    errors.value[index].dateOfObtainment = error.value.data.error[`${index}.dateOfObtainment`][0];
                } else {
                    errors.value[index].dateOfObtainment = '';
                }

                if (error.value.data.error[`${index}.location`]) {
                    errors.value[index].location = error.value.data.error[`${index}.location`][0];
                } else {
                    errors.value[index].location = '';
                }
            })
        }
    } else {
        errors.value.forEach((error, index) => {
            errors.value[index].certificationName = '';
            errors.value[index].certifyingAgency = '';
            errors.value[index].dateOfObtainment = '';
            errors.value[index].location = '';
        })

        if (!props.isFromDashboard) {
            onboarding.updateCurrentPage(5);
            onboarding.checkCurrentProgress(5);
        } else {
            if (props.isCreate) {
                navigateTo('/portal/skills-and-profession');
            } else {
                toast.success('Updated info successfully');
            }
        }
    }
};

const today = new Date().toISOString().split('T')[0];
</script>

<template>
    <form @submit.prevent="handleSubmit" class="col-span-3 m-24">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-2xl font-bold leading-7 text-gray-900">List of Credentials (If Applicable)</h2>

                <div v-for="(field, index) in form" :key="index"
                    class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 pb-12"
                    :class="{ 'border-b border-gray-900/10': index !== form.length - 1 }">

                    <div v-if="index > 0" @click="removeField(index)" class="sm:col-span-6 ml-auto -mb-12"><button
                            type="button"
                            class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Remove</button>
                    </div>

                    <div class="sm:col-span-3">
                        <BaseInputField id="certificationName" title="Certification Name"
                            v-model="field.certificationName" type="text"
                            :errorMessage="errors[index].certificationName" />
                    </div>

                    <div class="sm:col-span-3">
                        <BaseInputField id="certifyingAgency" title="Certifying Agency" v-model="field.certifyingAgency"
                            type="text" :errorMessage="errors[index].certifyingAgency" />
                    </div>

                    <div class="sm:col-span-3">
                        <BaseInputField id="dateOfObtainment" title="Date of Obtainment"
                            v-model="field.dateOfObtainment" type="date" :errorMessage="errors[index].dateOfObtainment"
                            :max="today" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="location" title="Location" v-model="field.location" type="text"
                            :errorMessage="errors[index].location" />
                    </div>

                </div>
                <div class="pt-8">
                    <button @click="addField"
                        class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        type="button">Add New Credentials</button>
                </div>
            </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button :disabled="onboarding.isLoading" type="submit"
                class="rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                :class="[
                    onboarding.isLoading
                        ? 'bg-gradient-to-r from-[#85a5ff] to-[#4b8dff] hover:shadow-none'
                        : 'bg-gradient-to-r from-[#468ef9] to-[#0c66ee]',
                ]">{{ onboarding.isLoading ? 'Loading...' : props.isFromDashboard
                    ? 'Submit' : 'Next' }}</button>
        </div>
    </form>
</template>