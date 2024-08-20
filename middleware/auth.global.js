import { useAuthStore } from '@/store/useAuthStore';
import { useOnboardingStore } from '~/store/useOnboardingStore';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const store = useAuthStore();
    const onboarding = useOnboardingStore();

    await store.fetchUser();

    if (store.user) {
      if (to.path === '/verify') {
        if (store.user.applicant.contact_number_verified_at || store.user.email_verified_at) {
          if (store.user.applicant.applications.length === 0) {
            return navigateTo('/onboarding');
          } else {
            return navigateTo('/portal');
          }
        }
      }

      if (to.path === '/portal') {
        if (!store.user.applicant.contact_number_verified_at && !store.user.email_verified_at) {
            return navigateTo('/verify');
        }

        if (store.user.applicant.applications.length === 0) {
            return navigateTo('/onboarding');
        }
      }

      if (to.path === '/onboarding') {
        if (!store.user.applicant.contact_number_verified_at && !store.user.email_verified_at) {
          return navigateTo('/verify');
          }

        if (store.user.applicant.applications.length > 0) {
            return navigateTo('/portal');
        }
      }

      if (to.path === '/' || to.path === '/login' || to.path === '/register' || to.path === '/forgot-password' || to.path === '/reset-password') {
        if (store.user.applicant.applications.length === 0) {
            return navigateTo('/onboarding');
        } else {
            return navigateTo('/portal');
        }
      }
    } else {
      if (to.path.includes('/portal') || to.path.includes('/onboarding') || to.path.includes('/verify')) {
        return navigateTo('/login');
      }

      if (to.path.includes('/reset-password') && !to.query.token) {
        console.log('wow');
        return navigateTo('/forgot-password');
      }
    }
  }
});