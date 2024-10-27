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
        ? JSON.parse(applications[applications.length - 1].work_experience) ?? [
            {
                companyName: '',
                companyAddress: '',
                employmentType: '',
                employmentTypeQuery: '',
                jobTitle: '',
                industry: '',
                industryQuery: '',
                startDate: '',
                endDate: '',
            }
        ]
        : [
            {
                companyName: '',
                companyAddress: '',
                employmentType: '',
                employmentTypeQuery: '',
                jobTitle: '',
                industry: '',
                industryQuery: '',
                startDate: '',
                endDate: '',
            }
        ]
    : props.application ? JSON.parse(props.application.work_experience) : JSON.parse(applications[0].work_experience) ?? [
        {
            companyName: '',
            companyAddress: '',
            employmentType: '',
            employmentTypeQuery: '',
            jobTitle: '',
            industry: '',
            industryQuery: '',
            startDate: '',
            endDate: '',
        }
    ]
)

// Computed property that generates the array based on work_experience length
const errorsWithData = computed(() => {
    return Array.from({
        length: props.isCreate
            ? applications[applications.length - 1].is_draft
                ? JSON.parse(applications[applications.length - 1].work_experience)?.length
                : 0
            : props.application ? JSON.parse(props.application.work_experience)?.length : JSON.parse(applications[0].work_experience)?.length ?? 0
    }, () => ({
        companyName: '',
        companyAddress: '',
        employmentType: '',
        employmentTypeQuery: '',
        jobTitle: '',
        industry: '',
        industryQuery: '',
        startDate: '',
        endDate: '',
    }));
});

const errors = ref(errorsWithData.value.length > 0 ? errorsWithData.value : [
    {
        companyName: '',
        companyAddress: '',
        employmentType: '',
        employmentTypeQuery: '',
        jobTitle: '',
        industry: '',
        industryQuery: '',
        startDate: '',
        endDate: '',
    }
]);

const addField = () => {
    form.value.push({
        companyName: '',
        companyAddress: '',
        employmentType: '',
        employmentTypeQuery: '',
        jobTitle: '',
        industry: '',
        industryQuery: '',
        startDate: '',
        endDate: '',
    })
    errors.value.push({
        companyName: '',
        companyAddress: '',
        employmentType: '',
        employmentTypeQuery: '',
        jobTitle: '',
        industry: '',
        industryQuery: '',
        startDate: '',
        endDate: '',
    })
}

const removeField = (index) => {
    form.value.splice(index, 1)
    errors.value.splice(index, 1)
}

const handleSubmit = async () => {
    const { error } = await onboarding.submitWorkExperience(form.value, auth.user.applicant.id, props.application);

    if (error.value?.data?.error) {
        if (typeof error.value.data.error !== 'string') {
            errors.value.forEach((err, index) => {
                if (error.value.data.error[`${index}.companyName`]) {
                    errors.value[index].companyName = error.value.data.error[`${index}.companyName`][0];
                } else {
                    errors.value[index].companyName = '';
                }

                if (error.value.data.error[`${index}.companyAddress`]) {
                    errors.value[index].companyAddress = error.value.data.error[`${index}.companyAddress`][0];
                } else {
                    errors.value[index].companyAddress = '';
                }

                if (error.value.data.error[`${index}.employmentType`]) {
                    errors.value[index].employmentType = error.value.data.error[`${index}.employmentType`][0];
                } else {
                    errors.value[index].employmentType = '';
                }

                if (error.value.data.error[`${index}.jobTitle`]) {
                    errors.value[index].jobTitle = error.value.data.error[`${index}.jobTitle`][0];
                } else {
                    errors.value[index].jobTitle = '';
                }

                if (error.value.data.error[`${index}.industry`]) {
                    errors.value[index].industry = error.value.data.error[`${index}.industry`][0];
                } else {
                    errors.value[index].industry = '';
                }

                if (error.value.data.error[`${index}.startDate`]) {
                    errors.value[index].startDate = error.value.data.error[`${index}.startDate`][0];
                } else {
                    errors.value[index].startDate = '';
                }

                if (error.value.data.error[`${index}.endDate`]) {
                    errors.value[index].endDate = error.value.data.error[`${index}.endDate`][0];
                } else {
                    errors.value[index].endDate = '';
                }
            })
        }
    } else {
        errors.value.forEach((error, index) => {
            errors.value[index].companyName = '';
            errors.value[index].companyAddress = '';
            errors.value[index].employmentType = '';
            errors.value[index].jobTitle = '';
            errors.value[index].industry = '';
            errors.value[index].startDate = '';
            errors.value[index].endDate = '';
        })

        if (!props.isFromDashboard) {
            onboarding.updateCurrentPage(4);
            onboarding.checkCurrentProgress(4);
        } else {
            if (props.isCreate) {
                navigateTo('/portal/list-of-credentials');
            } else {
                toast.success('Updated info successfully');
            }
        }
    }
};

const filteredEmploymentType = (query) =>
    query === ''
        ? employmentTypes
        : employmentTypes.filter((el) => {
            return el.value.toLowerCase().includes(query.toLowerCase())
        }
        )

const filteredIndustry = (query) =>
    query === ''
        ? industries
        : industries.filter((el) => {
            return el.value.toLowerCase().includes(query.toLowerCase())
        }
        )

</script>

<template>
    <form @submit.prevent="handleSubmit" class="col-span-3 m-24">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-2xl font-bold leading-7 text-gray-900">Work Experience (If Applicable)</h2>

                <div v-for="(field, index) in form" :key="index"
                    class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 pb-12"
                    :class="{ 'border-b border-gray-900/10': index !== form.length - 1 }">

                    <div v-if="index > 0" @click="removeField(index)" class="sm:col-span-6 ml-auto -mb-12"><button
                            type="button"
                            class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Remove</button>
                    </div>

                    <div class="sm:col-span-3">
                        <BaseInputField id="companyName" title="Company Name" v-model="field.companyName" type="text"
                            :errorMessage="errors[index].companyName" />
                    </div>

                    <div class="sm:col-span-3">
                        <BaseInputField id="companyAddress" title="Company Address" v-model="field.companyAddress"
                            type="text" :errorMessage="errors[index].companyAddress" />
                    </div>

                    <div class="sm:col-span-2">
                        <Combobox as="div" v-model="field.employmentType"
                            @update:modelValue="field.employmentTypeQuery = ''">
                            <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">Employment Type
                            </ComboboxLabel>
                            <div class="relative mt-2">
                                <ComboboxInput
                                    class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    @change="field.employmentTypeQuery = $event.target.value"
                                    @blur="field.employmentTypeQuery = ''" :display-value="(type) => type"
                                    placeholder="Select Employment Type" />
                                <ComboboxButton
                                    class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>

                                <ComboboxOptions v-if="filteredEmploymentType(field.employmentTypeQuery).length > 0"
                                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    <ComboboxOption v-for="el in filteredEmploymentType(field.employmentTypeQuery)"
                                        :key="el.value" :value="el.text" as="template" v-slot="{ active, selected }">
                                        <li
                                            :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-blue-600 text-white' : 'text-gray-900']">
                                            <span :class="['block truncate', selected && 'font-semibold']">
                                                {{ el.text }}
                                            </span>

                                            <span v-if="selected"
                                                :class="['absolute inset-y-0 left-0 flex items-center pl-1.5', active ? 'text-white' : 'text-blue-600']">
                                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        </li>
                                    </ComboboxOption>
                                </ComboboxOptions>
                            </div>
                        </Combobox>
                        <p v-if="errors[index].employmentType" class="text-red-600 text-sm mt-1">{{
                            errors[index].employmentType }}</p>
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="jobTitle" title="Job Title" v-model="field.jobTitle" type="text"
                            :errorMessage="errors[index].jobTitle" />
                    </div>

                    <div class="sm:col-span-2">
                        <Combobox as="div" v-model="field.industry" @update:modelValue="field.industryQuery = ''">
                            <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">Industry
                            </ComboboxLabel>
                            <div class="relative mt-2">
                                <ComboboxInput
                                    class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    @change="field.industryQuery = $event.target.value" @blur="field.industryQuery = ''"
                                    :display-value="(industry) => industry" placeholder="Select Industry" />
                                <ComboboxButton
                                    class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>

                                <ComboboxOptions v-if="filteredIndustry(field.industryQuery).length > 0"
                                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    <ComboboxOption v-for="el in filteredIndustry(field.industryQuery)" :key="el.value"
                                        :value="el.text" as="template" v-slot="{ active, selected }">
                                        <li
                                            :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-blue-600 text-white' : 'text-gray-900']">
                                            <span :class="['block truncate', selected && 'font-semibold']">
                                                {{ el.text }}
                                            </span>

                                            <span v-if="selected"
                                                :class="['absolute inset-y-0 left-0 flex items-center pl-1.5', active ? 'text-white' : 'text-blue-600']">
                                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        </li>
                                    </ComboboxOption>
                                </ComboboxOptions>
                            </div>
                        </Combobox>
                        <p v-if="errors[index].industry" class="text-red-600 text-sm mt-1">{{
                            errors[index].industry }}</p>
                    </div>

                    <div class="sm:col-span-3">
                        <BaseInputField id="startDate" title="Start Date" v-model="field.startDate" type="date"
                            :errorMessage="errors[index].startDate" />
                    </div>

                    <div class="sm:col-span-3">
                        <BaseInputField id="endDate" title="End Date" v-model="field.endDate" type="date"
                            :errorMessage="errors[index].endDate" />
                    </div>

                </div>
                <div class="pt-8">
                    <button @click="addField"
                        class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        type="button">Add New Work Experience</button>
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