<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useAuthStore } from '~/store/useAuthStore';
import { useOnboardingStore } from '~/store/useOnboardingStore';
import { coursesAndPrograms } from '~/utils/coursesAndPrograms';
import { educationalLevels } from '~/utils/educationalLevels';

const auth = useAuthStore();
const onboarding = useOnboardingStore();

onMounted(() => {
    auth.fetchUser();
})

const form = ref({
    schoolName: '',
    educationalLevel: '',
    level: '',
    course: '',
    startDate: '',
    endDate: '',
    honorsReceived: ''
});

const errors = reactive({
    schoolName: '',
    educationalLevel: '',
    level: '',
    course: '',
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

const isNotCollege = computed(() => {
    const disallowedLevels = [
        '1st Year College',
        '2nd Year College',
        '3rd Year College',
        '4th Year College',
        '5th Year College',
        'Post Graduate'
    ];
    return disallowedLevels.includes(form.value.educationalLevel);
});

watch(() => form.value.educationalLevel, (newLevel) => {
    if (!isNotCollege.value) {
        form.value.level = ''
        form.value.course = ''
    }
});
</script>

<template>
    <form @submit.prevent="handleSubmit" class="col-span-3 m-24">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-2xl font-bold leading-7 text-gray-900">Educational Background</h2>

                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div class="sm:col-span-2">
                        <BaseInputField id="schoolName" title="School Name" v-model="form.schoolName" type="text"
                            :errorMessage="errors?.schoolName" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseSelectField id="educationalLevel" title="Educational Level" v-model="form.educationalLevel"
                            :errorMessage="errors?.educationalLevel">
                            <option value="" disabled selected hidden>~ Select educational level ~</option>
                            <option v-for="level in educationalLevels" :key="level.value" :value="level.value">
                                {{ level.text }}
                            </option>
                        </BaseSelectField>
                    </div>

                    <div class="sm:col-span-2">
                        <BaseSelectField id="level" title="Level" v-model="form.level" :errorMessage="errors?.level"
                            :disabled="!isNotCollege">
                            <option value="" disabled selected hidden>~ Select level ~</option>
                            <option value="Vocational">Vocational</option>
                            <option value="Programs">Programs</option>
                            <option value="College">College</option>
                            <option value="Post Graduate">Post Graduate</option>
                        </BaseSelectField>
                    </div>

                    <div class="sm:col-span-2">
                        <BaseSelectField id="course" title="course" v-model="form.course" :errorMessage="errors?.course"
                            :disabled="!isNotCollege">
                            <option value="" disabled selected hidden>~ Select course ~</option>
                            <option v-for="course in coursesAndPrograms" :key="course.value" :value="course.value">
                                {{ course.text }}
                            </option>
                        </BaseSelectField>
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="startDate" title="Start Date" v-model="form.startDate" type="date"
                            :errorMessage="errors?.startDate" />
                    </div>

                    <div class="sm:col-span-2">
                        <BaseInputField id="endDate" title="End Date" v-model="form.endDate" type="date"
                            :errorMessage="errors?.endDate" />
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