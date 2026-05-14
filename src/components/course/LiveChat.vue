<script setup>
import { ref, nextTick } from 'vue'

const messagesEl = ref(null)

const messages = ref([
  {
    id: 1,
    initial: 'Б',
    avatarClass: 'bg-primary-container text-on-primary-container',
    name: 'Бат-Эрдэнэ',
    time: '12:41',
    text: "Энэ 'Бүгд эсвэл юу ч биш' гэдэг алдааг би байнга гаргадаг юм байна.",
    isInstructor: false,
  },
  {
    id: 2,
    initial: 'А',
    avatarClass: 'bg-tertiary-container text-on-tertiary-container',
    name: 'Анужин',
    time: '12:43',
    text: 'Үүнийг яаж анзаарч засах вэ? Дараагийн хичээл дээр гарах болов уу?',
    isInstructor: false,
  },
  {
    id: 3,
    initial: 'school',
    avatarClass: 'bg-secondary text-on-secondary',
    name: 'Багш Саруул',
    time: '12:44',
    text: "Тийм ээ, Анужин. Дараагийн модульд бид 'Танин мэдэхүйн дахин бүтцэл' (Cognitive restructuring) техникийг үзнэ.",
    isInstructor: true,
  },
])

const newMessage = ref('')

async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text) return
  const now = new Date()
  messages.value.push({
    id: Date.now(),
    initial: 'Та',
    avatarClass: 'bg-primary-container text-on-primary-container',
    name: 'Та',
    time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
    text,
    isInstructor: false,
  })
  newMessage.value = ''
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}
</script>

<template>
  <div class="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(93,138,168,0.08)] flex flex-col h-[480px] sm:h-[500px]">

    <!-- Header -->
    <div class="p-4 border-b border-surface-variant flex justify-between items-center shrink-0">
      <h3 class="font-newsreader text-lg text-on-surface flex items-center gap-2">
        <span class="material-symbols-outlined text-secondary">forum</span>
        Шууд хэлэлцүүлэг
      </h3>
      <span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
        <span class="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
        Шууд
      </span>
    </div>

    <!-- Messages -->
    <div ref="messagesEl" class="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex gap-3"
        :class="msg.isInstructor ? 'bg-surface-container p-2 -mx-2 rounded-lg' : ''"
      >
        <!-- Avatar -->
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm font-semibold shrink-0"
          :class="msg.avatarClass"
        >
          <span v-if="msg.isInstructor" class="material-symbols-outlined text-[16px]">school</span>
          <span v-else>{{ msg.initial }}</span>
        </div>

        <!-- Bubble -->
        <div>
          <div class="flex items-baseline gap-2 flex-wrap">
            <span
              class="font-sans text-sm font-semibold"
              :class="msg.isInstructor ? 'text-primary' : 'text-on-surface'"
            >{{ msg.name }}</span>
            <span
              v-if="msg.isInstructor"
              class="bg-primary/10 text-primary text-[9px] px-1.5 rounded uppercase tracking-wider font-bold"
            >Багш</span>
            <span class="font-sans text-[10px] text-on-surface-variant">{{ msg.time }}</span>
          </div>
          <p class="font-sans text-sm text-on-surface mt-0.5 leading-relaxed">{{ msg.text }}</p>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="p-4 border-t border-surface-variant bg-surface-container-lowest rounded-b-xl shrink-0">
      <div class="flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2 border border-surface-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Сэтгэгдэл бичих..."
          class="bg-transparent border-none focus:ring-0 font-sans text-sm w-full p-0 placeholder:text-outline text-on-surface outline-none"
          @keydown.enter="sendMessage"
        />
        <button class="text-primary hover:text-primary-fixed transition-colors shrink-0" @click="sendMessage">
          <span class="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>

  </div>
</template>
