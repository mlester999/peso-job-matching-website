<script setup>
import { Dialog, DialogPanel } from '@headlessui/vue'
import { ref } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
]

const mobileMenuOpen = ref(false)
</script>

<template>
    <header class="absolute inset-x-0 top-0 z-50">
        <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div class="flex lg:flex-1">
                <NuxtLink href="/" class="-m-1.5 p-1.5">
                    <span class="sr-only">PESO Icon</span>
                    <img class="h-20 w-auto" src="/public/peso_icon_no_bg.png" alt="" />
                </NuxtLink>
            </div>
            <div class="flex lg:hidden">
                <button type="button"
                    class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
                    @click="mobileMenuOpen = true">
                    <span class="sr-only">Open main menu</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <!-- <div class="hidden lg:flex lg:gap-x-12">
                <a v-for="item in navigation" :key="item.name" :href="item.href"
                    class="text-sm font-semibold leading-6 text-white">{{ item.name }}</a>
            </div> -->
            <div class="hidden lg:flex lg:flex-1 lg:justify-end">
                <NuxtLink href="/login" class="text-sm font-semibold leading-6 text-white">Log in <span
                        aria-hidden="true">&rarr;</span></NuxtLink>
            </div>
        </nav>
        <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
            <div class="fixed inset-0 z-50" />
            <DialogPanel
                class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div class="flex items-center justify-between">
                    <a href="#" class="-m-1.5 p-1.5">
                        <span class="sr-only">PESO Icon</span>
                        <img class="h-16 w-auto" src="/public/peso_icon_no_bg.png" alt="" />
                    </a>
                    <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
                        <span class="sr-only">Close menu</span>
                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div class="mt-6 flow-root">
                    <div class="-my-6 divide-y divide-gray-500/10">
                        <!-- <div class="space-y-2 py-6">
                            <a v-for="item in navigation" :key="item.name" :href="item.href"
                                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{{
                                    item.name }}</a>
                        </div> -->
                        <div class="py-6">
                            <a href="#"
                                class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log
                                in</a>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </Dialog>
    </header>
</template>