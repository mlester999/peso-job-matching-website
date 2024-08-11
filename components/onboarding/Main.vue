<script setup>
import { useOnboardingStore } from '~/store/useOnboardingStore';

const onboarding = useOnboardingStore();
</script>

<template>
    <div class="grid grid-cols-4 h-screen ">
        <BaseOnboardingSidebar />

        <OnboardingPersonalInformationForm v-if="onboarding.currentPage === 1" />

        <OnboardingEducationalBackgroundForm v-if="onboarding.currentPage === 2" />

        <OnboardingWorkExperienceForm v-if="onboarding.currentPage === 3" />

        <OnboardingSkillsAndProfessionForm v-if="onboarding.currentPage === 4" />

        <OnboardingConfirmationForm v-if="onboarding.currentPage === 5" />
    </div>
</template>