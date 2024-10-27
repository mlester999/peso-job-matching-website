<script setup>
import { useAuthStore } from '~/store/useAuthStore';

const route = useRoute();

const auth = useAuthStore();

const application = auth.user.applicant.applications.find((el) => {
    return el.id === Number(route.params.id)
})

onMounted(() => {
    auth.fetchUser();
})

</script>

<template>
    <div>
        <OnboardingPersonalInformationForm :isFromDashboard="true" :application="application" />

        <OnboardingEducationalBackgroundForm :isFromDashboard="true" :application="application" />

        <OnboardingWorkExperienceForm :isFromDashboard="true" :application="application" />

        <OnboardingListOfCredentialsForm :isFromDashboard="true" :application="application" />

        <OnboardingSkillsAndProfessionForm :isFromDashboard="true" :application="application" />
    </div>
</template>