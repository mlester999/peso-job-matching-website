import { defineStore } from 'pinia';
import { useApiFetch } from '~/composables/useApiFetch';

export const useOnboardingStore = defineStore('onboarding', () => {
  const currentPage = ref(1);
  const currentProgress = ref(1);
  const isLoading = ref(false);
  const jobPositions = ref([]);
  const jobPositionSkills = ref([]);

  const getJobPositions = async () => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');
    const { data } = await useApiFetch('/api/job-positions');

    isLoading.value = false;

    jobPositions.value = data.value.jobPositions;
  };

  const setJobPositionSkills = async (skills) => {
    jobPositionSkills.value = skills;
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

  const submitSkills = async (info, applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const submitSkillsResponse = await useApiFetch(`/api/submit-skills/${applicantId}`, {
      method: 'POST',
      body: info,
    });

    isLoading.value = false;

    return submitSkillsResponse;
  };

  const updateCurrentPage = (newPage) => {
    currentPage.value = newPage;
  }

  const checkCurrentProgress = (progress) => {
    currentProgress.value = progress;
  }

  return { currentPage, isLoading, currentProgress, jobPositions, jobPositionSkills, getJobPositions, setJobPositionSkills, submitPersonalInformation, submitEducationalBackground, submitWorkExperience, submitSkills, updateCurrentPage, checkCurrentProgress };
});