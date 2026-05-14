<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import VideoPlayer from '../components/course/VideoPlayer.vue'
import LessonTabs  from '../components/course/LessonTabs.vue'
import UpNextCard  from '../components/course/UpNextCard.vue'
import LiveChat    from '../components/course/LiveChat.vue'

const bookmarked = ref(false)
</script>

<template>
  <div class="flex-grow pt-[80px] pb-16 flex justify-center w-full">
    <main class="w-full max-w-container-max-width px-margin-mobile md:px-margin-desktop flex flex-col gap-gutter">

      <!-- Breadcrumb + Title -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end mt-8 mb-4 gap-4">
        <div>
          <nav class="font-sans text-xs text-on-surface-variant mb-2 flex items-center gap-2 flex-wrap">
            <RouterLink to="/library" class="hover:text-primary transition-colors">
              Танин мэдэхүйн сэтгэл судлал
            </RouterLink>
            <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            <span class="text-primary font-semibold">Модуль 2</span>
          </nav>
          <h1 class="font-newsreader text-3xl sm:text-4xl font-medium text-on-surface">
            Модуль 2: Танин мэдэхүйн алдааг илрүүлэх
          </h1>
        </div>

        <button
          class="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors font-sans text-sm font-semibold shrink-0 self-start sm:self-auto"
          @click="bookmarked = !bookmarked"
        >
          <span
            class="material-symbols-outlined text-[20px] transition-colors"
            :class="bookmarked ? 'text-primary' : ''"
            :style="bookmarked ? { fontVariationSettings: `'FILL' 1` } : {}"
          >bookmark{{ bookmarked ? '' : '_border' }}</span>
          {{ bookmarked ? 'Хадгалагдсан' : 'Хадгалах' }}
        </button>
      </div>

      <!-- 2/3 + 1/3 grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">

        <!-- Main column -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <VideoPlayer />
          <LessonTabs />
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 flex flex-col gap-6">
          <UpNextCard />
          <LiveChat />
        </div>

      </div>
    </main>
  </div>
</template>
