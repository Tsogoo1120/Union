<script setup>
import { ref, computed } from 'vue'

const isPlaying = ref(false)
const isMuted   = ref(false)
const progress  = ref(45) // 0–100 percent

const TOTAL = 28 * 60 + 30 // 28:30 in seconds

function fmt(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

const currentTime = computed(() => fmt((progress.value / 100) * TOTAL))
const totalTime    = computed(() => fmt(TOTAL))

function seek(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const pct  = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
  progress.value = pct
}

function togglePlay() { isPlaying.value = !isPlaying.value }
function toggleMute()  { isMuted.value  = !isMuted.value }
</script>

<template>
  <div class="w-full aspect-video bg-inverse-surface rounded-xl overflow-hidden relative shadow-[0_8px_30px_rgba(93,138,168,0.12)] group">

    <!-- Background image -->
    <img
      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR4JVZfW_QBnHhEhYsouaa1Vp_6Ug1HWXdGQIEhwCzwb2C6Acf9AEMY6rBLRMIJ-QN3kSG8wuoRYFfVbGUCzk8P59LMkeEf65MGQagfYlVwifKbF_KblCNf89_QHow5IucsFtEK3Yxt6DYdEXjWaS9n9BukXAS6gFp4PIL7ZTMxlIZaIGP6jc48BaPDIVMvVlflyIbKAtf59qX6OecSmQC1tflUg2dZCzwg0tNeIngixjFILz3V7exSIfWMyN0fI7Qodue-K5sjrQ"
      alt="Video thumbnail"
      class="w-full h-full object-cover opacity-80 mix-blend-overlay"
    />

    <!-- Gradient overlay -->
    <div class="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">

      <!-- Central play/pause -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <button
          class="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 text-white pointer-events-auto hover:bg-white/30 transition-all hover:scale-105"
          @click="togglePlay"
        >
          <span class="material-symbols-outlined text-[28px] sm:text-[32px] ml-0.5" :style="{ fontVariationSettings: `'FILL' 1` }">
            {{ isPlaying ? 'pause' : 'play_arrow' }}
          </span>
        </button>
      </div>

      <!-- Bottom controls -->
      <div class="flex flex-col gap-2 sm:gap-3">

        <!-- Progress bar -->
        <div
          class="w-full h-1.5 bg-white/30 rounded-full cursor-pointer relative"
          @click="seek"
        >
          <div
            class="absolute top-0 left-0 h-full bg-secondary rounded-full transition-all"
            :style="{ width: progress + '%' }"
          />
          <div
            class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-all"
            :style="{ left: progress + '%', transform: 'translate(-50%, -50%)' }"
          />
        </div>

        <!-- Controls row -->
        <div class="flex justify-between items-center text-white">
          <div class="flex items-center gap-3 sm:gap-4">
            <button class="hover:text-primary-fixed transition-colors" @click="togglePlay">
              <span class="material-symbols-outlined text-[20px]">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
            </button>
            <button class="hover:text-primary-fixed transition-colors" @click="toggleMute">
              <span class="material-symbols-outlined text-[20px]">{{ isMuted ? 'volume_off' : 'volume_up' }}</span>
            </button>
            <span class="font-sans text-xs font-medium tabular-nums">{{ currentTime }} / {{ totalTime }}</span>
          </div>
          <div class="flex items-center gap-3 sm:gap-4">
            <button class="hover:text-primary-fixed transition-colors hidden sm:block">
              <span class="material-symbols-outlined text-[20px]">closed_caption</span>
            </button>
            <button class="hover:text-primary-fixed transition-colors hidden sm:block">
              <span class="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <button class="hover:text-primary-fixed transition-colors">
              <span class="material-symbols-outlined text-[20px]">fullscreen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
