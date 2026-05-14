<script setup>
import { ref, computed } from 'vue'
import CourseCard from './CourseCard.vue'

const allCourses = [
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJvNYjUd5nmT5L8xW3_hCcOaEEj4q2U4JXXUzDUbzzffNmIYSy5wrjD_bPlpTCDELtpcA0k1Uh2aBKrHspiK-RboMRIn32AyUveHzL8DTs7mFOOjukxFumPrycS3nrv_1ybgqnUzLKKhEMnTe1MXo5H_Su9ufgkrnH-7lzM9CK64LbEO-FcUCj9dpDcpt6liFO-IHFj9oH9jnVNYu8y20xuus2JGI-prjvR6xJnq540h5229LXMz1Yk_xv515VmCtzKQg3MVv2Pmg',
    category: 'Клиникийн',
    categoryIcon: 'psychology',
    badgeClass: 'bg-secondary-container text-on-secondary-container',
    title: 'Танин мэдэхүйн зан үйлийн засал',
    description: 'Сөрөг бодлуудаа таньж, зан үйлийн өөрчлөлт хийх практик аргуудыг суралцах цогц хөтөлбөр.',
    duration: '8 долоо хоног',
  },
  {
    id: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKiX_mBxf_ieWmkXVh5KZeuizqAumot3Pes0ag0tdUmsY69I_4XSIAnnhQGdb8UCG7xsZdyPmnz9TO07GTDEfs-NV9EqLL6WeochbXdv6uDq9odmDe7JzJQqB4uFZuNAk8THt54Kz41DKZrmN3A2tPHr72IAKGliOyIK60tIKi6qUac5h0uZO-7Kg1y_qfiGR5UPTL7IL-dcJ0Vs72IrPdN1_O5X2UvNcPGEL1vkrQraRjXVUbC0gKzKxhkAo_9ZSjEZX-YNWKK0k',
    category: 'Бясалгал',
    categoryIcon: 'self_improvement',
    badgeClass: 'bg-[#F0F4F0] text-secondary',
    title: 'Сэтгэл амар амьдрах нь',
    description: 'Өдөр тутмын стрессийг бууруулах, анхаарал төвлөрөлтөө сайжруулах энгийн бөгөөд үр дүнтэй дасгалууд.',
    duration: '4 долоо хоног',
  },
  {
    id: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa9Sz5-w9ZLkFBk0Olhb6u9KFEF54jBQ0bAbJP399TvF65dA7xqNL2sbb0I6oJEStTvqTE9-hPSvC_0j7_auqQF_ACkV4PJ3LoHyUmdSgn7dk81q_FvXIcvHgHPaZzhT_fn7rL7QOl7bXkrdUstRGWDh-ZBJvM4icoeQpoUKU39C3nlv-7XeQUAUrXDcvW5GYXCHDcS4RHDnct4M_t3Vo6j-uCwko390Ksih0ggpFxUWsyLJKOR9w-FAVUk7oayE0abYWYfA-Sndc',
    category: 'Хөгжлийн',
    categoryIcon: 'child_care',
    badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    title: 'Хүүхдийн хөгжлийн онол',
    description: 'Хүүхдийн танин мэдэхүй, сэтгэл хөдлөл, нийгмийн хөгжлийн үе шатуудын талаарх суурь ойлголтууд.',
    duration: '6 долоо хоног',
  },
]

const filters = [
  { label: 'Бүх хичээл', value: 'all' },
  { label: 'Клиникийн',  value: 'Клиникийн' },
  { label: 'Хөгжлийн',  value: 'Хөгжлийн' },
  { label: 'Бясалгал',  value: 'Бясалгал' },
]

const activeFilter = ref('all')
const searchQuery  = ref('')

const filtered = computed(() => {
  let result = allCourses
  if (activeFilter.value !== 'all') {
    result = result.filter(c => c.category === activeFilter.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    )
  }
  return result
})
</script>

<template>
  <!-- Header row -->
  <div class="reveal mb-12 mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <h1 class="font-newsreader text-4xl sm:text-5xl font-semibold text-on-background mb-4">
        Хичээлийн сан
      </h1>
      <p class="font-sans text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
        Сэтгэл судлал, хувь хүний хөгжлийн талаарх шинжлэх ухааны үндэслэлтэй хичээлүүдээс сонгон суралцаарай.
      </p>
    </div>

    <!-- Search -->
    <div class="relative w-full md:w-72 shrink-0">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Хичээл хайх..."
        class="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-3 font-sans text-sm text-on-surface focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-[0_2px_10px_rgba(93,138,168,0.04)] outline-none"
      />
    </div>
  </div>

  <!-- Filter pills -->
  <div class="reveal reveal-delay-1 flex flex-wrap gap-3 mb-10 border-b border-surface-variant pb-4">
    <button
      v-for="f in filters"
      :key="f.value"
      class="px-5 py-2 rounded-full font-sans text-sm font-semibold transition-all duration-200 active:scale-95"
      :class="activeFilter === f.value
        ? 'bg-primary-container text-on-primary-container shadow-sm'
        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant'"
      @click="activeFilter = f.value"
    >
      {{ f.label }}
    </button>
  </div>

  <!-- Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <CourseCard
      v-for="course in filtered"
      :key="course.id"
      :course="course"
      class="reveal"
    />
  </div>

  <!-- Empty state -->
  <Transition name="fade">
    <div
      v-if="filtered.length === 0"
      class="flex flex-col items-center justify-center py-24 text-center gap-4"
    >
      <span class="material-symbols-outlined text-[64px] text-outline-variant">search_off</span>
      <p class="font-newsreader text-2xl text-on-surface-variant">Хичээл олдсонгүй</p>
      <p class="font-sans text-sm text-outline">Өөр үгээр хайж үзнэ үү.</p>
    </div>
  </Transition>
</template>
