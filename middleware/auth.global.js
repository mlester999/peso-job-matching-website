import { useAuthStore } from '@/store/useAuthStore';
// import { useMainPortalStore } from '@/store/useMainPortalStore';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const store = useAuthStore();
    // const portal = useMainPortalStore();

    await store.fetchUser();

    if (store.user) {
      if (to.path === '/portal') {
        if (store.user.applicant.applications.length === 0) {
            return navigateTo('/onboarding');
        }
        // await portal.getAllJobPositions();
      }

      if (to.path === '/' || to.path === '/login' || to.path === '/signup') {
        if (store.user.applicant.applications.length === 0) {
            return navigateTo('/onboarding');
        } else {
            return navigateTo('/portal');
        }
      }
    } else {
      if (to.path.includes('/portal') || to.path.includes('/onboarding')) {
        return navigateTo('/login');
      }
    }
  }
});