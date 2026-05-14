<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase.js'

const router  = useRouter()
const name    = ref('')
const email   = ref('')
const password= ref('')
const error   = ref('')
const loading = ref(false)
const sent    = ref(false)

async function register() {
  error.value   = ''
  loading.value = true

  const { error: err } = await supabase.auth.signUp({
    email:    email.value.trim(),
    password: password.value,
    options: {
      data: { full_name: name.value.trim() },
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  })

  loading.value = false

  if (err) {
    error.value = err.message
  } else {
    sent.value = true
  }
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 bg-background">
    <div class="w-full max-w-md">

      <!-- Success state -->
      <div v-if="sent" class="text-center space-y-4 animate-fade-in">
        <div class="mx-auto w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center">
          <span class="material-symbols-outlined text-[32px] text-secondary">mark_email_read</span>
        </div>
        <h1 class="font-newsreader text-3xl font-semibold text-on-surface">Имэйлээ шалгана уу</h1>
        <p class="font-sans text-on-surface-variant leading-relaxed">
          <strong class="text-on-surface">{{ email }}</strong> хаяг руу баталгаажуулах холбоос илгээлээ.
          Имэйлийнхээ хайрцагт орж холбоос дарна уу.
        </p>
        <p class="font-sans text-sm text-on-surface-variant">Спам хавтсыг ч шалгаарай.</p>
      </div>

      <!-- Register form -->
      <div v-else class="space-y-6 animate-fade-in">
        <div class="space-y-1">
          <h1 class="font-newsreader text-3xl font-semibold text-on-surface">Бүртгүүлэх</h1>
          <p class="font-sans text-on-surface-variant text-sm">Суралцах аяллаа эхлүүлцгээе</p>
        </div>

        <form @submit.prevent="register" class="space-y-4">

          <!-- Full name -->
          <div class="space-y-1.5">
            <label class="font-sans text-sm font-medium text-on-surface-variant">Бүтэн нэр</label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="Овог Нэр"
              class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest font-sans text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>

          <!-- Email -->
          <div class="space-y-1.5">
            <label class="font-sans text-sm font-medium text-on-surface-variant">Имэйл хаяг</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="name@example.com"
              class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest font-sans text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label class="font-sans text-sm font-medium text-on-surface-variant">Нууц үг</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              placeholder="Дор хаяж 6 тэмдэгт"
              class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest font-sans text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>

          <!-- Error -->
          <p v-if="error" class="font-sans text-sm text-error bg-error-container/30 px-4 py-3 rounded-xl">
            {{ error }}
          </p>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-on-primary py-3 rounded-xl font-sans text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_12px_rgba(50,97,125,0.2)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            {{ loading ? 'Уншиж байна...' : 'Бүртгүүлэх' }}
          </button>
        </form>
      </div>

    </div>
  </main>
</template>
