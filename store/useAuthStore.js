import { defineStore } from 'pinia';
import { useApiFetch } from '~/composables/useApiFetch';
import nuxtStorage from 'nuxt-storage';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isLoading = ref(false);
  const errorMessage = ref('');
  const emailForReset = ref('');
  const topSkillsDemand = ref(null);
  const industryGrowth = ref(null);

  const fetchTopSkillsDemand = async () => {
    const token = nuxtStorage.localStorage.getData('Token');

    if (token) {
      try {
        const { data } = await useApiFetch('/api/top-skills-demand');

        topSkillsDemand.value = data.value;
      } catch (error) {
        console.error('Error fetching top skills demand data:', error);
      }
    }
  };

  const fetchIndustryGrowth = async () => {
    const token = nuxtStorage.localStorage.getData('Token');

    if (token) {
      try {
        const { data } = await useApiFetch('/api/industry-growth');

        industryGrowth.value = data.value;
      } catch (error) {
        console.error('Error fetching indstury growth data:', error);
      }
    }
  };

  const fetchUser = async () => {
    const token = nuxtStorage.localStorage.getData('Token');

    if (token) {
      try {
        const { data } = await useApiFetch('/api/user', {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });

        user.value = data.value;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const fetchResetPasswordEmail = async (token, email) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const fetchResponse = await useApiFetch(`/api/get-email-from-token`, {
      method: 'POST',
      body: {token, email}
    });

    if (fetchResponse?.error?.value?.data?.message) {
      errorMessage.value = fetchResponse?.error?.value?.data?.message;
      navigateTo('/forgot-password');
    } else {
      errorMessage.value = '';
    }
    return fetchResponse
  };

  const logout = async () => {
    isLoading.value = true;
    await useApiFetch('/logout', { method: 'POST' });
    user.value = null;
    nuxtStorage.localStorage.setData('Token', null);

    isLoading.value = false;
    navigateTo('/login');
  };

  const login = async (credentials) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const loginResponse = await useApiFetch('/api/login', {
      method: 'POST',
      body: credentials,
    });

    if (loginResponse.data?.value?.token) {
      const { data } = await useApiFetch('/api/user', {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + loginResponse.data.value.token,
        },
      });

      nuxtStorage.localStorage.setData(
        'Token',
        loginResponse.data.value.token,
        300
      );

      user.value = data.value;

      return navigateTo('/portal');
    }

    isLoading.value = false;

    return loginResponse;
  };

  const register = async (info) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const registerResponse = await useApiFetch('/api/register', {
      method: 'POST',
      body: info,
    });

    if (registerResponse.data?.value?.token) {
      const { data } = await useApiFetch('/api/user', {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + registerResponse.data.value.token,
        },
      });

      nuxtStorage.localStorage.setData(
        'Token',
        registerResponse.data.value.token,
        300
      );

      user.value = data.value;

      return navigateTo('/verify');
    }

    isLoading.value = false;

    return registerResponse;
  };

  const application = async (val) => {
    isLoading.value = true;

    const formData = new FormData();
    formData.append('resume_path', val.resume_path);
    formData.append('applicant_id', val.applicant_id);

    try {
      const { data, error } = await useFetch(
        'http://localhost:8000/api/application',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (data) {
        console.log(data);
        // return navigateTo('/portal');
      }

      isLoading.value = false;

      return error;
    } catch (error) {
      isLoading.value = false;
      return error;
    }
  };

  const verifyUsingSms = async (applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const smsResponse = await useApiFetch(`/api/verify-using-sms/${applicantId}`, {
      method: 'POST'
    });

    isLoading.value = false;

    return smsResponse.data?.value?.otp[0];
  };

  const verifyUsingEmail = async (applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const emailResponse = await useApiFetch(`/api/verify-using-email/${applicantId}`, {
      method: 'POST'
    });

    isLoading.value = false;

    return emailResponse.data?.value?.otp;
  };

  const verifyContactNumber = async (applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const contactNumberResponse = await useApiFetch(`/api/verify-contact-number/${applicantId}`, {
      method: 'PUT'
    });

    isLoading.value = false;

    return navigateTo('/onboarding');
  };

  const verifyEmailAddress = async (applicantId) => {
    isLoading.value = true;
    await useApiFetch('/sanctum/csrf-cookie');

    const emailAddressResponse = await useApiFetch(`/api/verify-email-address/${applicantId}`, {
      method: 'PUT'
    });

    isLoading.value = false;

    return navigateTo('/onboarding');
  };

    const sendResetPasswordLink = async (info) => {
      isLoading.value = true;
      await useApiFetch('/sanctum/csrf-cookie');
  
      const resetResponse = await useApiFetch('/api/send-reset-password-link', {
        method: 'POST',
        body: info,
      });
  
      isLoading.value = false;
  
      return resetResponse;
    };

    const resetPassword = async (info) => {
      isLoading.value = true;
      await useApiFetch('/sanctum/csrf-cookie');
  
      const resetResponse = await useApiFetch('/api/reset-password', {
        method: 'POST',
        body: info,
      });
  
      isLoading.value = false;
  
      return resetResponse;
    };

    const updateViewedNotifications = async (applicantId) => {
      isLoading.value = true;
      await useApiFetch('/sanctum/csrf-cookie');
  
      const updatedNotificationsResponse = await useApiFetch(`/api/update-notifications/${applicantId}`, {
        method: 'PUT'
      });
  
      isLoading.value = false;
  
      return updatedNotificationsResponse;
    };

  return { user, isLoading, errorMessage, emailForReset, topSkillsDemand, industryGrowth, login, logout, register, application, verifyUsingSms, verifyUsingEmail, verifyContactNumber, verifyEmailAddress, sendResetPasswordLink, resetPassword, fetchUser, fetchResetPasswordEmail, updateViewedNotifications, fetchTopSkillsDemand, fetchIndustryGrowth };
});