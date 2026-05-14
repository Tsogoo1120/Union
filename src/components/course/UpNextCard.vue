<template>
  <div class="bg-surface-container-lowest rounded-xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(93,138,168,0.08)] flex flex-col">

    <h3 class="font-sans text-xs font-bold text-on-surface-variant mb-4 uppercase tracking-wider">Дараагийн</h3>

    <!-- Thumbnail + info -->
    <div class="flex gap-4 mb-6">
      <div class="w-24 h-16 bg-surface-container-high rounded-md overflow-hidden relative shrink-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOkTWLV4C6KScXDB8GLODZ5-tEloAVkVXznEzeVB-Zfoi1oYdB52sQKQzSHa6P74HT0FurJmOeinTTs0OpzMSG2P7l0qAPDXI5RBXLnMeNv6soth7iJSNGzPh6p7Mygonp3ErB8dfINvXp3hZa-0R5bM37WUMrhmT6EjKFpS73BGn7GMTdDdiQdyxdvxb2_eTscF7hyRv7v2vAgGi_L9TX6TpBeQ76X1xcEFZUGwBLtMZP5tvqoj2kwaleyb_VAX3yzVVCTDW-rmc"
          alt="Next lesson"
          class="w-full h-full object-cover"
        />
        <div class="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded font-medium">15:20</div>
      </div>
      <div class="min-w-0">
        <h4 class="font-sans text-sm font-semibold text-on-surface leading-tight mb-1">
          Модуль 3: Алдааг засах техникүүд
        </h4>
        <p class="font-sans text-xs text-on-surface-variant">Дадлага ажил · 3-р хэсэг</p>
      </div>
    </div>

    <RouterLink
      to="/course"
      class="w-full bg-primary text-on-primary font-sans text-sm font-semibold py-3 rounded-full hover:bg-surface-tint transition-colors flex items-center justify-center gap-2"
    >
      Дараагийн хичээл
      <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
    </RouterLink>

  </div>
</template>
