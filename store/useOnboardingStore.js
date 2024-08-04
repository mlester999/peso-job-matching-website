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

  const updateCurrentPage = (newPage) => {
    currentPage.value = newPage;
  }

  const checkCurrentProgress = (progress) => {
    currentProgress.value = progress;
  }

  return { currentPage, isLoading, currentProgress, submitPersonalInformation, updateCurrentPage, checkCurrentProgress };
});