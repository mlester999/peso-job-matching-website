import { defineStore } from 'pinia';
import { useApiFetch } from '~/composables/useApiFetch';
import nuxtStorage from 'nuxt-storage';

export const useOnboardingStore = defineStore('onboarding', () => {
  const currentPage = ref(1);
  const currentProgress = ref(1);
  const isLoading = ref(false);
  const jobPositions = ref([]);

  const getJobPositions = async () => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');
    const { data } = await useApiFetch('/api/job-positions');
    jobPositions.value = data.value.jobPositions;
  };

  const submitPersonalInformation = async (info, applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const personalInformationResponse = await useApiFetch(`/api/submit-personal-information/${applicantId}`, {
      method: 'POST',
      body: info,
    });

    isLoading.value = false;

    return personalInformationResponse;
  };

  const submitEducationalBackground = async (info, applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const submitEducationalResponse = await useApiFetch(`/api/submit-educational-background/${applicantId}`, {
      method: 'POST',
      body: info,
    });

    isLoading.value = false;

    return submitEducationalResponse;
  };

  const submitWorkExperience = async (info, applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const submitWorkExperienceResponse = await useApiFetch(`/api/submit-work-experience/${applicantId}`, {
      method: 'POST',
      body: info,
    });

    isLoading.value = false;

    return submitWorkExperienceResponse;
  };

  const updateCurrentPage = (newPage) => {
    currentPage.value = newPage;
  }

  const checkCurrentProgress = (progress) => {
    currentProgress.value = progress;
  }

  return { currentPage, isLoading, currentProgress, jobPositions, getJobPositions, submitPersonalInformation, submitEducationalBackground, submitWorkExperience, updateCurrentPage, checkCurrentProgress };
});