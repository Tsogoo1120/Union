<script setup>
const smallCards = [
  {
    icon: 'spa',
    iconBg: 'bg-primary-container/20',
    iconColor: 'text-primary',
    title: 'Сэтгэл амар амьдрах',
    desc: 'Стресс болон түгшүүрийг бууруулах, өдөр тутмын амьдралдаа тайван байдлыг бий болгох дадлууд.',
  },
  {
    icon: 'psychology',
    iconBg: 'bg-secondary-container/30',
    iconColor: 'text-secondary',
    title: 'Нейропластик чанар',
    desc: 'Тархины өөрчлөгдөх, дасан зохицох чадварыг ашиглан шинэ эерэг дадал зуршлыг хэрхэн бий болгох вэ.',
  },
]
</script>

<template>
  <section class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop mb-[120px]">

    <!-- Header -->
    <div class="reveal text-center mb-12 space-y-4">
      <h2 class="font-newsreader text-3xl sm:text-4xl font-medium text-on-surface">Онцлох хичээлүүд</h2>
      <p class="font-sans text-base text-on-surface-variant max-w-2xl mx-auto">
        Бидний хамгийн их эрэлттэй, үр дүн нь батлагдсан сэтгэл зүйн хөтөлбөрүүд.
      </p>
    </div>

    <!-- 3-column bento, each row ~250px -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[250px]">

      <!-- CBT — spans 2 cols + 2 rows, image with overlay -->
      <div class="reveal md:col-span-2 md:row-span-2 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(93,138,168,0.08)] relative overflow-hidden group flex flex-col justify-end min-h-[340px] md:min-h-0 cursor-pointer">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-_n9Qpph4I1Pu_1jvxnmLDoByHR_BVaARHT6m2q1RKlY90Nb8GwIuDkjHtAVQ_Z_VD_J5kEkTmHauTC0V0SWbMl4LR7fkbs1NrgxBaA0mNP4ejRP8z8atrP-kg9ehwUbpP8h7JKcQ5YvOOwAhFLwnpyXoGiYMSKGZLIgorWhRhE47nMHG4uGauZ7_2JelXB2fqBG3cb3ROZU1w1IfrrfE4KiK9rJBuJHO0Klcy1VT_woLTo7xposNNmg47M7mnGMjnzpfpiULXfw"
          alt="Abstract thought patterns"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0"
        />
        <div class="relative z-20 p-6 sm:p-8 space-y-3">
          <span class="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm font-sans text-xs font-medium text-white">
            Танин мэдэхүй
          </span>
          <h3 class="font-newsreader text-2xl sm:text-[26px] font-medium text-white">CBT-ийн удиртгал</h3>
          <p class="font-sans text-sm text-white/90 max-w-md leading-relaxed">
            Танин мэдэхүйн зан үйлийн эмчилгээний үндэстэй танилцаж, сөрөг бодлоо удирдах аргад суралцаарай.
          </p>
        </div>
      </div>

      <!-- Small cards -->
      <div
        v-for="(card, i) in smallCards"
        :key="card.title"
        class="reveal bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(93,138,168,0.08)] flex flex-col hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
        :class="i === 1 ? 'reveal-delay-1' : ''"
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          :class="card.iconBg"
        >
          <span
            class="material-symbols-outlined"
            :class="card.iconColor"
            style="font-variation-settings: 'FILL' 1;"
          >{{ card.icon }}</span>
        </div>
        <h3 class="font-newsreader text-xl font-medium text-on-surface mb-2">{{ card.title }}</h3>
        <p class="font-sans text-sm text-on-surface-variant leading-relaxed flex-grow">{{ card.desc }}</p>
        <a href="#" class="mt-4 font-sans text-sm font-semibold text-primary flex items-center gap-1 group w-fit">
          Дэлгэрэнгүй
          <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </a>
      </div>

    </div>
  </section>
</template>
