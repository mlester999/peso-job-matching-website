// plugins/vue-input-otp.ts
import { OTPInput } from 'vue-input-otp'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('OTPInput', OTPInput);
});
