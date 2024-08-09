<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useAuthStore } from '~/store/useAuthStore';
import { useOnboardingStore } from '~/store/useOnboardingStore';
import { coursesAndPrograms } from '~/utils/coursesAndPrograms';
import { educationalLevels } from '~/utils/educationalLevels';
import { levels } from '~/utils/levels';
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
})

const form = ref([
    {
        schoolName: '',
        educationalLevel: '',
        educationalLevelQuery: '',
        level: '',
        levelQuery: '',
        course: '',
        courseQuery: '',
        startDate: '',
        endDate: '',
    }
])

const errors = ref([
    {
        schoolName: '',
        educationalLevel: '',
        educationalLevelQuery: '',
        level: '',
        levelQuery: '',
        course: '',
        courseQuery: '',
        startDate: '',
        endDate: '',
    }
]);

const addField = () => {
    form.value.push({
        schoolName: '',
        educationalLevel: '',
        educationalLevelQuery: '',
        level: '',
        levelQuery: '',
        course: '',
        courseQuery: '',
        startDate: '',
        endDate: '',
    })
    errors.value.push({
        schoolName: '',
        educationalLevel: '',
        educationalLevelQuery: '',
        level: '',
        levelQuery: '',
        course: '',
        courseQuery: '',
        startDate: '',
        endDate: '',
    })
}

const removeField = (index) => {
    form.value.splice(index, 1)
    errors.value.splice(index, 1)
}

const handleSubmit = async () => {
    const { error } = await onboarding.submitEducationalBackground(form.value, auth.user.applicant.id);

    console.log('error: ', error.value?.data?.error);
    console.log('typeof error: ', typeof error.value?.data?.error);
    if (error.value?.data?.error) {
        if (typeof error.value.data.error !== 'string') {
            errors.value.forEach((err, index) => {
                if (error.value.data.error[`${index}.schoolName`]) {
                    errors.value[index].schoolName = error.value.data.error[`${index}.schoolName`][0];
                } else {
                    errors.value[index].schoolName = '';
                }

                if (error.value.data.error[`${index}.educationalLevel`]) {
                    errors.value[index].educationalLevel = error.value.data.error[`${index}.educationalLevel`][0];
                } else {
                    errors.value[index].educationalLevel = '';
                }

                if (error.value.data.error[`${index}.level`]) {
                    errors.value[index].level = error.value.data.error[`${index}.level`][0];
                } else {
                    errors.value[index].level = '';
                }

                if (error.value.data.error[`${index}.course`]) {
                    errors.value[index].course = error.value.data.error[`${index}.course`][0];
                } else {
                    errors.value[index].course = '';
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
            errors.value[index].schoolName = '';
            errors.value[index].educationalLevel = '';
            errors.value[index].level = '';
            errors.value[index].course = '';
            errors.value[index].startDate = '';
            errors.value[index].endDate = '';
        })
        onboarding.updateCurrentPage(3);
    }
};

const checkEducationalLevel = (index) => {
    const disallowedLevels = [
        '1st Year College',
        '2nd Year College',
        '3rd Year College',
        '4th Year College',
        '5th Year College',
        'Post Graduate'
    ];

    const isNotCollege = disallowedLevels.includes(form.value[index].educationalLevel);

    if (!isNotCollege) {
        form.value[index].level = ''
        form.value[index].course = ''

    }

    return isNotCollege;
};

const filteredEducationalLevel = (query) =>
    query === ''
        ? educationalLevels
        : educationalLevels.filter((el) => {
            return el.value.toLowerCase().includes(query.toLowerCase())
        }
        )

const filteredLevel = (query) =>
    query === ''
        ? levels
        : levels.filter((el) => {
            return el.value.toLowerCase().includes(query.toLowerCase())
        }
        )

const filteredCourse = (query) =>
    query === ''
        ? coursesAndPrograms
        : coursesAndPrograms.filter((el) => {
            return el.value.toLowerCase().includes(query.toLowerCase())
        }
        )
</script>

<template>
    <form @submit.prevent="handleSubmit" class="col-span-3 m-24">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-2xl font-bold leading-7 text-gray-900">Educational Background</h2>

                <div v-for="(field, index) in form" :key="index"
                    class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 pb-12"
                    :class="{ 'border-b border-gray-900/10': index !== form.length - 1 }">

                    <div v-if="index > 0" @click="removeField(index)" class="sm:col-span-6 ml-auto -mb-12"><button
                            class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Remove</button>
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="schoolName" title="School Name" v-model="field.schoolName" type="text"
                            :errorMessage="errors[index].schoolName" />
                    </div>

                    <div class="sm:col-span-2">
                        <Combobox as="div" v-model="field.educationalLevel"
                            @update:modelValue="field.educationalLevelQuery = ''">
                            <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">Educational Level
                            </ComboboxLabel>
                            <div class="relative mt-2">
                                <ComboboxInput
                                    class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    @change="field.educationalLevelQuery = $event.target.value"
                                    @blur="field.educationalLevelQuery = ''" :display-value="(level) => level" />
                                <ComboboxButton
                                    class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>

                                <ComboboxOptions v-if="filteredEducationalLevel(field.educationalLevelQuery).length > 0"
                                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    <ComboboxOption v-for="el in filteredEducationalLevel(field.educationalLevelQuery)"
                                        :key="el.value" :value="el.value" as="template" v-slot="{ active, selected }">
                                        <li
                                            :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-blue-600 text-white' : 'text-gray-900']">
                                            <span :class="['block truncate', selected && 'font-semibold']">
                                                {{ el.value }}
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
                        <p v-if="errors[index].educationalLevel" class="text-red-600 text-sm mt-1">{{
                            errors[index].educationalLevel }}</p>
                    </div>

                    <div class="sm:col-span-2">
                        <Combobox as="div" v-model="field.level" @update:modelValue="field.levelQuery = ''"
                            :disabled="!checkEducationalLevel(index)">
                            <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">Level
                            </ComboboxLabel>
                            <div class="relative mt-2">
                                <ComboboxInput
                                    class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    @change="field.levelQuery = $event.target.value" @blur="field.levelQuery = ''"
                                    :display-value="(level) => level" />
                                <ComboboxButton
                                    class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>

                                <ComboboxOptions v-if="filteredLevel(field.levelQuery).length > 0"
                                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    <ComboboxOption v-for="el in filteredLevel(field.levelQuery)" :key="el.value"
                                        :value="el.value" as="template" v-slot="{ active, selected }">
                                        <li
                                            :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-blue-600 text-white' : 'text-gray-900']">
                                            <span :class="['block truncate', selected && 'font-semibold']">
                                                {{ el.value }}
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
                        <p v-if="errors[index].level" class="text-red-600 text-sm mt-1">{{
                            errors[index].level }}</p>
                    </div>

                    <div class="sm:col-span-2">
                        <Combobox as="div" v-model="field.course" @update:modelValue="field.courseQuery = ''"
                            :disabled="!checkEducationalLevel(index)">
                            <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">Course
                            </ComboboxLabel>
                            <div class="relative mt-2">
                                <ComboboxInput
                                    class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    @change="field.courseQuery = $event.target.value" @blur="field.courseQuery = ''"
                                    :display-value="(course) => course" />
                                <ComboboxButton
                                    class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>

                                <ComboboxOptions v-if="filteredCourse(field.courseQuery).length > 0"
                                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    <ComboboxOption v-for="el in filteredCourse(field.courseQuery)" :key="el.value"
                                        :value="el.value" as="template" v-slot="{ active, selected }">
                                        <li
                                            :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-blue-600 text-white' : 'text-gray-900']">
                                            <span :class="['block truncate', selected && 'font-semibold']">
                                                {{ el.value }}
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
                        <p v-if="errors[index].course" class="text-red-600 text-sm mt-1">{{
                            errors[index].course }}</p>
                    </div>

                    <!-- <div class="sm:col-span-2">
                        <BaseSelectField id="level" title="Level" v-model="field.level" :errorMessage="errors?.level"
                            :disabled="!checkEducationalLevel">
                            <option value="" disabled selected hidden>~ Select level ~</option>
                            <option value="Vocational">Vocational</option>
                            <option value="Programs">Programs</option>
                            <option value="College">College</option>
                            <option value="Post Graduate">Post Graduate</option>
                        </BaseSelectField>
                    </div> -->
                    <!-- 
                    <div class="sm:col-span-2">
                        <BaseSelectField id="course" title="Course" v-model="field.course"
                            :errorMessage="errors?.course" :disabled="!checkEducationalLevel(index)">
                            <option value="" disabled selected hidden>~ Select course ~</option>
                            <option v-for="course in coursesAndPrograms" :key="course.value" :value="course.value">
                                {{ course.text }}
                            </option>
                        </BaseSelectField>
                    </div> -->

                    <div class="sm:col-span-2">
                        <BaseInputField id="startDate" title="Start Date" v-model="field.startDate" type="date"
                            :errorMessage="errors[index].startDate" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="endDate" title="End Date" v-model="field.endDate" type="date"
                            :errorMessage="errors[index].endDate" />
                    </div>

                </div>
                <div class="pt-8">
                    <button @click="addField"
                        class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        type="button">Add New Education</button>
                </div>
            </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="submit"
                class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Next</button>
        </div>
    </form>
</template>