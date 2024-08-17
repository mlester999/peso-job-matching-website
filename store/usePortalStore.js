import { defineStore } from 'pinia';
import { useApiFetch } from '~/composables/useApiFetch';

export const usePortalStore = defineStore('portal', () => {
  const toastMessage = ref('');
  const isLoading = ref(false);
  const isUpdated = ref(false);

  const submitPersonalInformation = async (info, applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const personalInformationResponse = await useApiFetch(`/api/my-profile/update-personal-information/${applicantId}`, {
      method: 'PUT',
      body: info,
    });

    isLoading.value = false;
    isUpdated.value = true;

    toastMessage.value = 'Updated info successfully';

    return personalInformationResponse;
  };

  const submitUpdatedPassword = async (info, applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const updatedPasswordResponse = await useApiFetch(`/api/my-profile/update-password/${applicantId}`, {
      method: 'PUT',
      body: info,
    });

    isLoading.value = false;
    isUpdated.value = true;

    toastMessage.value = 'Password updated successfully! Please log in again with your new password';

    return updatedPasswordResponse;
  };

  const logoutOtherSessions = async (info, applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const logoutOtherSessionsResponse = await useApiFetch(`/api/my-profile/logout-other-sessions/${applicantId}`, {
      method: 'POST',
      body: info,
    });

    isLoading.value = false;
    isUpdated.value = true;

    toastMessage.value = 'Other sessions have been logged out successfully';

    return logoutOtherSessionsResponse;
  };

  const hideToastMessage = () => {
    isUpdated.value = false;
    toastMessage.value = '';
  }

  return { toastMessage, isLoading, isUpdated, submitPersonalInformation, submitUpdatedPassword, logoutOtherSessions, hideToastMessage };
});