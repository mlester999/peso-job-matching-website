<script setup>
import { useOnboardingStore } from '~/store/useOnboardingStore';

const onboarding = useOnboardingStore();
</script>

<template>
    <div class="grid grid-cols-4 h-screen ">
        <BaseOnboardingSidebar />

        <OnboardingPersonalInformationForm v-if="onboarding.currentPage === 1" />

        <OnboardingEducationalBackgroundForm v-if="onboarding.currentPage === 2" />
    </div>
</template>