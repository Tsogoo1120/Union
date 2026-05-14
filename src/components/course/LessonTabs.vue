<script setup>
import { ref } from 'vue'

const activeTab = ref('notes')

const distortions = [
  {
    icon: 'psychology',
    title: 'Бүгд эсвэл юу ч биш (All-or-nothing)',
    desc: 'Аливаа зүйлийг зөвхөн хар эсвэл цагаан өнгөөр харах. "Би төгс хийхгүй л бол бүтэлгүйтсэн гэсэн үг."',
  },
  {
    icon: 'visibility',
    title: 'Хэтрүүлэн ерөнхийлөх (Overgeneralization)',
    desc: 'Нэг удаагийн сөрөг үйл явдлыг дуусашгүй бүтэлгүйтлийн цуваа мэтээр хүлээж авах.',
  },
]
</script>

<template>
  <div class="bg-surface-container-lowest rounded-xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(93,138,168,0.08)]">

    <!-- Tab nav -->
    <div class="flex border-b border-surface-variant mb-6">
      <button
        class="px-5 sm:px-6 py-3 font-sans text-sm font-semibold border-b-2 transition-colors"
        :class="activeTab === 'notes'
          ? 'border-primary text-primary'
          : 'border-transparent text-on-surface-variant hover:text-on-surface'"
        @click="activeTab = 'notes'"
      >
        Хичээлийн тэмдэглэл
      </button>
      <button
        class="px-5 sm:px-6 py-3 font-sans text-sm font-semibold border-b-2 transition-colors"
        :class="activeTab === 'transcript'
          ? 'border-primary text-primary'
          : 'border-transparent text-on-surface-variant hover:text-on-surface'"
        @click="activeTab = 'transcript'"
      >
        Бичвэр
      </button>
    </div>

    <!-- Notes tab -->
    <Transition name="fade" mode="out-in">
      <div v-if="activeTab === 'notes'" key="notes" class="text-on-surface">
        <h3 class="font-newsreader text-2xl font-medium mb-4 text-primary">Гол ойлголтууд</h3>
        <p class="font-sans text-base text-on-surface-variant mb-6 leading-relaxed">
          Танин мэдэхүйн алдаа (Cognitive distortions) гэдэг нь бидний бодит байдлыг гуйвуулан хардаг системтэй сэтгэлгээний алдаанууд юм. Эдгээр нь сөрөг сэтгэл хөдлөл, түгшүүр, депрессийг тэжээж байдаг.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="d in distortions"
            :key="d.title"
            class="bg-surface-container-low p-4 rounded-lg border border-surface-variant/50"
          >
            <h4 class="font-sans text-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-[18px]">{{ d.icon }}</span>
              {{ d.title }}
            </h4>
            <p class="font-sans text-sm text-on-surface-variant leading-relaxed">{{ d.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Transcript tab -->
      <div v-else key="transcript" class="text-on-surface-variant font-sans text-sm leading-relaxed space-y-4">
        <p><span class="text-outline font-medium tabular-nums mr-3">00:00</span>Энэ хичээлд бид танин мэдэхүйн алдаануудыг хэрхэн таних талаар үзнэ.</p>
        <p><span class="text-outline font-medium tabular-nums mr-3">01:24</span>Эхний алдаа нь "Бүгд эсвэл юу ч биш" буюу хар-цагаан сэтгэлгээ юм.</p>
        <p><span class="text-outline font-medium tabular-nums mr-3">04:10</span>Хоёр дахь алдаа нь "Хэтрүүлэн ерөнхийлөх" юм...</p>
        <p><span class="text-outline font-medium tabular-nums mr-3">08:45</span>Эдгээр алдааг таних нь эмчилгээний хамгийн чухал алхам болдог.</p>
        <p><span class="text-outline font-medium tabular-nums mr-3">12:30</span>Дараагийн модульд бид тэдгээрийг засах техникийг үзнэ...</p>
      </div>
    </Transition>

  </div>
</template>
