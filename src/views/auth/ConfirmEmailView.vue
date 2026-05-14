<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase.js'

const route  = useRoute()
const router = useRouter()
const status = ref('loading') // 'loading' | 'success' | 'error'
const errorMsg = ref('')

onMounted(async () => {
  const token_hash = route.query.token_hash
  const type       = route.query.type

  if (!token_hash || !type) {
    status.value   = 'error'
    errorMsg.value = 'Буруу баталгаажуулах холбоос. Дахин бүртгүүлнэ үү.'
    return
  }

  const { error } = await supabase.auth.verifyOtp({ token_hash, type })

  if (error) {
    status.value   = 'error'
    errorMsg.value = error.message
  } else {
    status.value = 'success'
    setTimeout(() => router.push('/'), 3000)
  }
})
</script>

<template>
  <main class="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 bg-background">
    <div class="w-full max-w-md text-center space-y-6 animate-fade-in">

      <!-- Loading -->
      <template v-if="status === 'loading'">
        <div class="mx-auto w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
          <span class="material-symbols-outlined text-[32px] text-primary animate-spin">progress_activity</span>
        </div>
        <h1 class="font-newsreader text-3xl font-semibold text-on-surface">Баталгаажуулж байна...</h1>
        <p class="font-sans text-on-surface-variant">Түр хүлээнэ үү.</p>
      </template>

      <!-- Success -->
      <template v-else-if="status === 'success'">
        <div class="mx-auto w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center">
          <span class="material-symbols-outlined text-[32px] text-secondary">check_circle</span>
        </div>
        <h1 class="font-newsreader text-3xl font-semibold text-on-surface">Амжилттай баталгаажлаа!</h1>
        <p class="font-sans text-on-surface-variant">
          Таны имэйл хаяг баталгаажлаа. Нүүр хуудас руу шилжиж байна...
        </p>
        <div class="w-8 h-1 bg-secondary-container-highest mx-auto rounded-full overflow-hidden">
          <div class="h-full bg-secondary animate-[width_3s_linear_forwards] w-0 rounded-full" style="animation: progressBar 3s linear forwards;" />
        </div>
      </template>

      <!-- Error -->
      <template v-else>
        <div class="mx-auto w-16 h-16 rounded-full bg-error-container flex items-center justify-center">
          <span class="material-symbols-outlined text-[32px] text-error">error</span>
        </div>
        <h1 class="font-newsreader text-3xl font-semibold text-on-surface">Баталгаажуулалт амжилтгүй</h1>
        <p class="font-sans text-on-surface-variant">{{ errorMsg }}</p>
        <RouterLink
          to="/register"
          class="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-sans text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_12px_rgba(50,97,125,0.2)]"
        >
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          Дахин бүртгүүлэх
        </RouterLink>
      </template>

    </div>
  </main>
</template>

<style scoped>
@keyframes progressBar {
  from { width: 0%; }
  to   { width: 100%; }
}
</style>
