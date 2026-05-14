<script setup>
import { ref } from 'vue'

const sliderValue = ref(33)
const selectedOption = ref('energy')

const options = [
  { id: 'sleep',  label: 'Нойргүйдэлтэй байгаа' },
  { id: 'energy', label: 'Эрч хүч дутмаг байна' },
]
</script>

<template>
  <section class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop mb-[80px]">
    <div class="reveal bg-tertiary-container/10 rounded-[24px] p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 sm:gap-12 relative overflow-hidden">

      <!-- Decorative blobs -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <!-- Left: text -->
      <div class="flex-1 space-y-6 relative z-10">
        <h2 class="font-newsreader text-3xl sm:text-4xl font-medium text-on-surface">
          Өөрийн оношилгоог хийх
        </h2>
        <p class="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed">
          Одоогоор таны сэтгэл зүйн байдал ямар байгааг тодорхойлох богино хэмжээний үнэлгээг хийгээрэй. Энэ нь танд ямар хичээл илүү тохирохыг санал болгоход тусална.
        </p>
        <button class="bg-primary text-on-primary px-8 py-4 rounded-lg font-sans text-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-[0_4px_12px_rgba(50,97,125,0.2)]">
          Үнэлгээ эхлүүлэх
        </button>
      </div>

      <!-- Right: interactive card -->
      <div class="flex-1 relative z-10 w-full max-w-sm">
        <div class="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(93,138,168,0.1)] space-y-6">

          <!-- Slider -->
          <div class="space-y-2">
            <label class="font-sans text-xs font-medium text-on-surface-variant">
              Сүүлийн 2 долоо хоногт та хэр их бухимдсан бэ?
            </label>
            <input
              v-model="sliderValue"
              type="range"
              min="0"
              max="100"
              class="w-full h-2 rounded-full appearance-none cursor-pointer accent-secondary bg-surface-variant"
            />
            <div class="flex justify-between font-sans text-xs text-on-surface-variant">
              <span>Огт үгүй</span>
              <span>Маш их</span>
            </div>
          </div>

          <!-- Radio options -->
          <div class="space-y-3 pt-4 border-t border-surface-variant">
            <div
              v-for="opt in options"
              :key="opt.id"
              class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200"
              :class="selectedOption === opt.id
                ? 'bg-primary/10 border-primary/30'
                : 'bg-background border-transparent hover:border-primary/20'"
              @click="selectedOption = opt.id"
            >
              <span
                class="material-symbols-outlined text-primary text-[22px] shrink-0"
                :style="selectedOption === opt.id ? { fontVariationSettings: `'FILL' 1` } : {}"
              >
                {{ selectedOption === opt.id ? 'radio_button_checked' : 'radio_button_unchecked' }}
              </span>
              <span class="font-sans text-sm text-on-surface">{{ opt.label }}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
