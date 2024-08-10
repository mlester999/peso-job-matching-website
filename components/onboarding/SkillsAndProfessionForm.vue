<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '~/store/useAuthStore';
import { useOnboardingStore } from '~/store/useOnboardingStore';
import { employmentTypes } from '~/utils/employmentTypes';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxLabel,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/vue'

const auth = useAuthStore();
const onboarding = useOnboardingStore();

onMounted(() => {
    auth.fetchUser();
    onboarding.getJobPositions();
})

const form = ref(
    {
        jobPositionId: "",
        jobPositionQuery: '',
        skills: []
    }
)

const errors = ref([
    {
        jobPositionId: '',
        jobPositionQuery: '',
        skills: []
    }
]);

const selectedJobPositiondId = ref();
const selectedJobPositionSkills = ref([]);

const addSkill = (val) => {
    form.value.skills.push(val);
}

const removeSkill = (title) => {
    const index = form.value.skills.indexOf(title);
    if (index !== -1) {
        form.value.skills.splice(index, 1);
    }
}

const handleSubmit = async () => {
    const { error } = await onboarding.submitSkillsAndProfession(form.value, auth.user.applicant.id);

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
            })
        }
    } else {
        errors.value.forEach((error, index) => {
            errors.value[index].jobPositionId = '';
            errors.value[index].skills = [];
        })
        onboarding.updateCurrentPage(5);
        onboarding.checkCurrentProgress(5);
    }
};

const filteredSkills = (query) =>
    query === ''
        ? onboarding.jobPositions
        : onboarding.jobPositions.filter((el) => {
            return el.value.toLowerCase().includes(query.toLowerCase())
        }
        )

watch(
    selectedJobPositiondId,
    (value) => {
        form.jobPositionId = value;
        const jobPosition = onboarding.jobPositions.find((job) => job.title == value)
        selectedJobPositionSkills.value = JSON.parse(jobPosition.skills)
        console.log('selectedJobPositionSkills: ', selectedJobPositionSkills.value);
    }
);

</script>

<template>
    <form @submit.prevent="handleSubmit" class="col-span-3 m-24">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-2xl font-bold leading-7 text-gray-900">Skills & Profession</h2>

                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 pb-12">
                    <div class="sm:col-span-6">
                        <Combobox as="div" class="max-w-lg" v-model="selectedJobPositiondId"
                            @update:modelValue="form.jobPositionQuery = ''">
                            <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">Search for Job
                                Title
                            </ComboboxLabel>
                            <div class="relative mt-2">
                                <ComboboxInput
                                    class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    @change="form.jobPositionQuery = $event.target.value"
                                    @blur="form.jobPositionQuery = ''" :display-value="(title) => title"
                                    placeholder="Select Job Title" />
                                <ComboboxButton
                                    class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>

                                <ComboboxOptions v-if="filteredSkills(form.jobPositionQuery).length > 0"
                                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    <ComboboxOption v-for="el in filteredSkills(form.jobPositionQuery)" :key="el.id"
                                        :value="el.title" as="template" v-slot="{ active, selected }">
                                        <li
                                            :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-blue-600 text-white' : 'text-gray-900']">
                                            <span :class="['block truncate', selected && 'font-semibold']">
                                                {{ el.title }}
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
                        <p v-if="errors.jobPositionId" class="text-red-600 text-sm mt-1">{{
                            errors.jobPositionId }}</p>
                    </div>

                    <div v-if="selectedJobPositionSkills && selectedJobPositionSkills.length > 0"
                        class="px-4 sm:px-0 md:col-span-3">
                        <h2 class="block text-sm font-medium leading-6 text-gray-900 pb-2">Related Skills: </h2>
                        <template v-for="(jobSkill, index) in selectedJobPositionSkills" :key="index">
                            <BaseCheckboxList :index="index" :title="jobSkill" :addSkill="addSkill"
                                :removeSkill="removeSkill" :currentSkills="form.skills" />
                        </template>
                        <p v-if="errors.skills" class="text-red-500 text-sm mt-1">
                            {{ errors.skills }}
                        </p>

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