<script setup>
import { useRoute, RouterLink } from 'vue-router'
import { useNavScroll } from '../composables/useNavScroll.js'

const { scrolled, navOpen } = useNavScroll()
const route = useRoute()

const navLinks = [
  { label: 'Хичээлүүд', to: '/',        icon: 'school',     activeFor: ['/', '/course'] },
  { label: 'Номын сан',  to: '/library', icon: 'menu_book',  activeFor: ['/library'] },
  { label: 'Тестүүд',   to: '#',        icon: 'quiz',        activeFor: [] },
  { label: 'Хамт олон', to: '#',        icon: 'group',       activeFor: [] },
]

function isActive(link) {
  return link.activeFor.includes(route.path)
}
</script>

<template>
  <header
    class="fixed top-0 w-full z-50 flex justify-between items-center px-4 sm:px-8 h-16 transition-all duration-300"
    :class="scrolled
      ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(93,138,168,0.12)]'
      : 'bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-[0_4px_20px_rgba(93,138,168,0.08)]'"
  >
    <!-- Logo -->
    <RouterLink to="/" class="text-xl sm:text-2xl font-semibold text-[#5D8AA8] tracking-tight shrink-0">
      PsycheFlow
    </RouterLink>

    <!-- Desktop links -->
    <nav class="hidden md:flex items-center gap-2 font-newsreader text-lg antialiased">
      <RouterLink
        v-for="link in navLinks"
        :key="link.label"
        :to="link.to"
        class="px-3 py-1 transition-all duration-300 ease-in-out"
        :class="isActive(link)
          ? 'text-[#5D8AA8] border-b-2 border-[#5D8AA8] pb-0.5 font-medium rounded-none'
          : 'text-slate-600 hover:text-[#5D8AA8] hover:bg-slate-50 rounded-lg'"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <!-- Desktop action -->
    <div class="flex items-center gap-3">
      <button class="hidden md:block font-newsreader text-lg antialiased text-[#5D8AA8] hover:bg-slate-50 rounded-lg px-4 py-2 transition-all duration-300 ease-in-out active:scale-95">
        Нэвтрэх
      </button>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Toggle menu"
        @click="navOpen = !navOpen"
      >
        <span class="block h-0.5 w-6 bg-[#5D8AA8] rounded-full transition-all duration-300" :class="navOpen ? 'rotate-45 translate-y-2' : ''" />
        <span class="block h-0.5 bg-[#5D8AA8] rounded-full transition-all duration-300"    :class="navOpen ? 'w-0 opacity-0' : 'w-4'" />
        <span class="block h-0.5 w-6 bg-[#5D8AA8] rounded-full transition-all duration-300" :class="navOpen ? '-rotate-45 -translate-y-2' : ''" />
      </button>
    </div>
  </header>

  <!-- Mobile drawer -->
  <Transition name="menu">
    <div
      v-if="navOpen"
      class="md:hidden fixed top-16 left-0 w-full z-40 bg-white/98 backdrop-blur-md border-t border-slate-100 shadow-lg"
    >
      <div class="px-4 py-3 space-y-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-sans font-semibold text-sm transition-colors"
          :class="isActive(link)
            ? 'bg-slate-50 text-[#5D8AA8]'
            : 'text-slate-600 hover:bg-slate-50 hover:text-[#5D8AA8]'"
          @click="navOpen = false"
        >
          <span class="material-symbols-outlined text-[20px] text-[#5D8AA8]/70">{{ link.icon }}</span>
          {{ link.label }}
        </RouterLink>
        <div class="pt-3 mt-1 border-t border-slate-100">
          <button class="w-full font-newsreader text-base text-[#5D8AA8] py-3 rounded-lg hover:bg-slate-50 transition-colors">
            Нэвтрэх
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
