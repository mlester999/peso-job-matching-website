<script setup>
import { ref, reactive, computed, watch } from 'vue'
import {
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import {
    Bars3Icon,
    BellIcon,
    DocumentDuplicateIcon,
    CheckBadgeIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
    AcademicCapIcon,
    BriefcaseIcon,
    IdentificationIcon,
    ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'
import {
    UserIcon
} from '@heroicons/vue/24/solid'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/store/useAuthStore';

const auth = useAuthStore();
const route = useRoute();
const applications = reactive(auth.user.applicant.applications);

const handleLogout = async () => {
    await auth.logout();
};

const displayGreeting = computed(() => {
    const date = new Date();
    const hrs = date.getHours();
    let greet;

    if (hrs < 12)
        greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17)
        greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24)
        greet = 'Good Evening';
    return greet
});

const navigation = ref([
    { name: 'Personal Information', href: '/portal/personal-information', icon: UsersIcon, disabled: false },
    { name: 'Educational Background', href: '/portal/educational-background', icon: AcademicCapIcon, disabled: Boolean(!applications[applications.length - 1].is_draft) || Boolean(!applications[applications.length - 1].zip_code) },
    { name: 'Work Experience', href: '/portal/work-experience', icon: BriefcaseIcon, disabled: Boolean(!applications[applications.length - 1].is_draft) || Boolean(!applications[applications.length - 1].education) },
    { name: 'List of Credentials', href: '/portal/list-of-credentials', icon: ClipboardDocumentListIcon, disabled: Boolean(!applications[applications.length - 1].is_draft) || Boolean(!applications[applications.length - 1].work_experience) },
    { name: 'Skills and Profession', href: '/portal/skills-and-profession', icon: DocumentDuplicateIcon, disabled: Boolean(!applications[applications.length - 1].is_draft) || Boolean(!applications[applications.length - 1].list_of_credentials) },
    { name: 'Confirmation', href: '/portal/confirmation', icon: CheckBadgeIcon, disabled: Boolean(!applications[applications.length - 1].is_draft) || Boolean(!applications[applications.length - 1].skills) },
    // { name: 'View Curriculum Vitae', href: '/portal/view-curriculum-vitae', icon: PrinterIcon },
]);
const userNavigation = [
    { name: 'My profile', href: '/portal/my-profile', type: 'link' },
]

const sidebarOpen = ref(false)

const showNotificationsDropdown = ref(false);

const isNotificationIconClicked = ref(false);

// Toggle Notification Dropdown
const toggleNotificationsDropdown = () => {
    showNotificationsDropdown.value = !showNotificationsDropdown.value;

    if (showNotificationsDropdown.value) {
        auth.updateViewedNotifications(auth.user.applicant.id);
        isNotificationIconClicked.value = true;
    }
};

const notifications = computed(() => {
    return auth.user.applicant.notifications;
});

const isNotificationsViewed = computed(() => {
    return auth.user.applicant.notifications.find(el => el.is_viewed == 1);
});

watch(() => auth.user, (user) => {
    navigation.value = [
        { name: 'Personal Information', href: '/portal/personal-information', icon: UsersIcon, disabled: false },
        { name: 'Educational Background', href: '/portal/educational-background', icon: AcademicCapIcon, disabled: Boolean(!user.applicant.applications[user.applicant.applications.length - 1].is_draft) || Boolean(!user.applicant.applications[user.applicant.applications.length - 1].zip_code) },
        { name: 'Work Experience', href: '/portal/work-experience', icon: BriefcaseIcon, disabled: Boolean(!user.applicant.applications[user.applicant.applications.length - 1].is_draft) || Boolean(!user.applicant.applications[user.applicant.applications.length - 1].education) },
        { name: 'List of Credentials', href: '/portal/list-of-credentials', icon: ClipboardDocumentListIcon, disabled: Boolean(!user.applicant.applications[user.applicant.applications.length - 1].is_draft) || Boolean(!user.applicant.applications[user.applicant.applications.length - 1].work_experience) },
        { name: 'Skills and Profession', href: '/portal/skills-and-profession', icon: DocumentDuplicateIcon, disabled: Boolean(!user.applicant.applications[user.applicant.applications.length - 1].is_draft) || Boolean(!user.applicant.applications[user.applicant.applications.length - 1].list_of_credentials) },
        { name: 'Confirmation', href: '/portal/confirmation', icon: CheckBadgeIcon, disabled: Boolean(!user.applicant.applications[user.applicant.applications.length - 1].is_draft) || Boolean(!user.applicant.applications[user.applicant.applications.length - 1].skills) },
        // { name: 'View Curriculum Vitae', href: '/portal/view-curriculum-vitae', icon: PrinterIcon },
    ]
}, { deep: true }); // Set deep: true if applications has nested objects/arrays


</script>

<template>
    <div>
        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
                <TransitionChild as="template" enter="transition-opacity ease-linear duration-300"
                    enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
                    leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-900/80" />
                </TransitionChild>

                <div class="fixed inset-0 flex">
                    <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                        enter-from="-translate-x-full" enter-to="translate-x-0"
                        leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                        leave-to="-translate-x-full">
                        <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                            <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                                enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                                leave-to="opacity-0">
                                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                        <span class="sr-only">Close sidebar</span>
                                        <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </TransitionChild>
                            <!-- Sidebar component, swap this element with another sidebar if you like -->
                            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-600 px-6 pb-4">
                                <div class="flex h-16 shrink-0 items-center">
                                    <img class="h-8 w-auto" src="/public/peso_icon_no_bg.png" alt="PESO Logo" />
                                </div>
                                <nav class="flex flex-1 flex-col">
                                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                        <li class="-mx-2 space-y-1">
                                            <NuxtLink href='/portal'
                                                :class="['/portal' === route.path ? 'bg-blue-700 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-700', 'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold']">
                                                <component :is="HomeIcon"
                                                    :class="['/portal' === route.path ? 'text-white' : 'text-blue-200 group-hover:text-white', 'h-6 w-6 shrink-0']"
                                                    aria-hidden="true" />
                                                Dashboard
                                            </NuxtLink>
                                        </li>
                                        <li>
                                            <ul role="list" class="-mx-2 space-y-1">
                                                <BaseDropdownMenu title="Create Job Application">
                                                    <li v-for="item in navigation" :key="item.name">
                                                        <NuxtLink :href="item.href"
                                                            :class="[item.href === route.path ? 'bg-blue-700 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-700', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                                                            <component :is="item.icon"
                                                                :class="[item.href === route.path ? 'text-white' : 'text-blue-200 group-hover:text-white', 'h-6 w-6 shrink-0']"
                                                                aria-hidden="true" />
                                                            {{ item.name }}
                                                        </NuxtLink>
                                                    </li>
                                                </BaseDropdownMenu>
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Static sidebar for desktop -->
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-600 px-6 pb-4">
                <div class="flex h-16 shrink-0 items-center">
                    <img class="h-10 w-auto" src="/public/peso_icon_no_bg.png" alt="PESO Logo" />
                    <h1 class="text-white text-2xl font-semibold ml-4">PESO Cabuyao</h1>
                </div>
                <nav class="flex flex-1 flex-col">
                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                        <li class="space-y-4">
                        <li>
                            <NuxtLink href='/portal'
                                :class="['/portal' === route.path ? 'bg-blue-700 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-700', 'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold']">
                                <component :is="HomeIcon"
                                    :class="['/portal' === route.path ? 'text-white' : 'text-blue-200 group-hover:text-white', 'h-6 w-6 shrink-0']"
                                    aria-hidden="true" />
                                Dashboard
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink href='/portal/my-applications'
                                :class="['/portal/my-applications' === route.path ? 'bg-blue-700 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-700', 'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold']">
                                <component :is="IdentificationIcon"
                                    :class="['/portal/my-applications' === route.path ? 'text-white' : 'text-blue-200 group-hover:text-white', 'h-6 w-6 shrink-0']"
                                    aria-hidden="true" />
                                My Applications
                            </NuxtLink>
                        </li>
                        <BaseDropdownMenu title="Create Job Application">
                            <li v-for="item in navigation" :key="item.name">
                                <NuxtLink event="" :href="item.disabled ? '' : item.href"
                                    :class="[item.href === route.path ? 'bg-blue-700 text-white' : 'text-blue-200', 'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold', item.disabled ? 'text-blue-400' : 'hover:text-white hover:bg-blue-700']">
                                    <component :is="item.icon"
                                        :class="[item.href === route.path ? 'text-white' : 'text-blue-200', 'h-6 w-6 shrink-0', item.disabled ? 'text-blue-400' : 'group-hover:text-white']"
                                        aria-hidden="true" />
                                    {{ item.name }}
                                </NuxtLink>
                            </li>
                        </BaseDropdownMenu>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <div class="lg:pl-72">
            <div
                class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
                    <span class="sr-only">Open sidebar</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>

                <!-- Separator -->
                <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

                <div class="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
                    <form class="relative flex flex-1" action="#" method="GET">
                        <h1 class="block h-full w-full font-semibold">Hello {{ auth.user.applicant.first_name }},
                            {{ displayGreeting }}!</h1>
                    </form>
                    <div class="flex items-center gap-x-4 lg:gap-x-6">
                        <div class="relative">
                            <button @click="toggleNotificationsDropdown" type="button"
                                class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                <span class="sr-only">View notifications</span>
                                <BellIcon class="h-6 w-6" aria-hidden="true" />
                                <span v-if="isNotificationsViewed && !isNotificationIconClicked"
                                    class="absolute right-0 top-0 block h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-green-400 ring-2 ring-white" />
                                <span v-else
                                    class="absolute right-0 top-0 block h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-gray-300 ring-2 ring-white" />
                            </button>

                            <div class="z-50 max-w-sm right-0 w-max my-4 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:divide-gray-600 dark:bg-gray-700"
                                :class="{
                                    hidden: !showNotificationsDropdown,
                                }" id="notification-dropdown" style="position: absolute"
                                data-popper-placement="bottom">
                                <div
                                    class="block px-4 py-2 text-base font-medium text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    Notifications
                                </div>
                                <div>
                                    <div v-if="notifications.length === 0"
                                        class="flex px-4 py-3 border-b dark:border-gray-600">
                                        <div class="w-full pl-3">
                                            <div class="text-gray-700 font-normal text-sm mb-1.5 dark:text-gray-200">
                                                There's no notification right now...
                                            </div>
                                        </div>
                                    </div>
                                    <BaseNotification :notifications="notifications" />
                                </div>
                            </div>
                        </div>

                        <!-- Separator -->
                        <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

                        <!-- Profile dropdown -->
                        <Menu as="div" class="relative">
                            <MenuButton class="-m-1.5 flex items-center p-1.5">
                                <span class="sr-only">Open user menu</span>
                                <UserIcon class="h-6 w-6 text-white rounded-full bg-gray-500 p-0.5"
                                    aria-hidden="true" />
                                <span class="hidden lg:flex lg:items-center">
                                    <span class="ml-4 text-sm font-semibold leading-6 text-gray-900"
                                        aria-hidden="true">{{ auth.user.applicant.first_name }} {{
                                            auth.user.applicant.last_name }}</span>
                                    <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </MenuButton>
                            <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                                <MenuItems
                                    class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                                    <NuxtLink :href="item.href"
                                        :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">
                                        {{
                                            item.name }}</NuxtLink>
                                    </MenuItem>
                                    <MenuItem>
                                    <button @click="handleLogout" type="button"
                                        class='block px-3 py-1 text-sm leading-6 text-red-600 hover:bg-gray-50 w-full text-left'>
                                        Log Out</button>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                </div>
            </div>

            <main class="py-10">
                <div class="px-4 sm:px-6 lg:px-8">
                    <slot></slot>
                </div>
            </main>
        </div>
    </div>
</template>