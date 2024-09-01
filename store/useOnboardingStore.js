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

  const submitPersonalInformation = async (info, applicantId, application) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    if (application) {
      const updatePersonalInformationResponse = await useApiFetch(`/api/update-personal-information/${application.id}`, {
        method: 'PUT',
        body: info,
      });
  
      isLoading.value = false;
  
      return updatePersonalInformationResponse;
    } else {
      const submitPersonalInformationResponse = await useApiFetch(`/api/submit-personal-information/${applicantId}`, {
        method: 'POST',
        body: info,
      });
  
      isLoading.value = false;
  
      return submitPersonalInformationResponse;
    }
  };

  const submitEducationalBackground = async (info, applicantId, application) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    if (application) {
      const updateEducationalResponse = await useApiFetch(`/api/update-educational-background/${application.id}`, {
        method: 'PUT',
        body: info,
      });

      isLoading.value = false;

      return updateEducationalResponse;
    } else {
      const submitEducationalResponse = await useApiFetch(`/api/submit-educational-background/${applicantId}`, {
        method: 'POST',
        body: info,
      });
  
      isLoading.value = false;
  
      return submitEducationalResponse;
    }
  };

  const submitWorkExperience = async (info, applicantId, application) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    if (application) {
      const updateWorkExperienceResponse = await useApiFetch(`/api/update-work-experience/${application.id}`, {
        method: 'PUT',
        body: info,
      });

      isLoading.value = false;

      return updateWorkExperienceResponse;
    } else {
      const submitWorkExperienceResponse = await useApiFetch(`/api/submit-work-experience/${applicantId}`, {
        method: 'POST',
        body: info,
      });
  
      isLoading.value = false;
  
      return submitWorkExperienceResponse;
    }
  };

  const submitSkills = async (info, applicantId, application) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    if (application) {
      const updateSkillsResponse = await useApiFetch(`/api/update-skills/${application.id}`, {
        method: 'POST',
        body: info,
      });

      isLoading.value = false;

      return updateSkillsResponse;
    } else {
      const submitSkillsResponse = await useApiFetch(`/api/submit-skills/${applicantId}`, {
        method: 'POST',
        body: info,
      });

      isLoading.value = false;

      return submitSkillsResponse;
    }
  };

  const confirmOnboarding = async (applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    await useApiFetch(`/api/confirm-onboarding/${applicantId}`, {
      method: 'POST',
    });

    isLoading.value = false;

    return navigateTo('/portal');
  };

  const updateCurrentPage = (newPage) => {
    currentPage.value = newPage;
  }

  const checkCurrentProgress = (progress) => {
    currentProgress.value = progress;
  }

  return { currentPage, isLoading, currentProgress, jobPositions, jobPositionSkills, getJobPositions, setJobPositionSkills, submitPersonalInformation, submitEducationalBackground, submitWorkExperience, submitSkills, confirmOnboarding, updateCurrentPage, checkCurrentProgress };
});