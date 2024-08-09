import { defineStore } from 'pinia';
import { useApiFetch } from '~/composables/useApiFetch';

export const useOnboardingStore = defineStore('onboarding', () => {
  const currentPage = ref(1);
  const currentProgress = ref(1);
  const isLoading = ref(false);

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

  const updateCurrentPage = (newPage) => {
    currentPage.value = newPage;
  }

  const checkCurrentProgress = (progress) => {
    currentProgress.value = progress;
  }

  return { currentPage, isLoading, currentProgress, submitPersonalInformation, submitEducationalBackground, updateCurrentPage, checkCurrentProgress };
});