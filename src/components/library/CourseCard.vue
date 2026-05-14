<script setup>
defineProps({
  course: { type: Object, required: true },
})
</script>

<template>
  <div class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(93,138,168,0.08)] transition-transform hover:-translate-y-1 duration-300 flex flex-col group cursor-pointer">

    <!-- Image -->
    <div class="h-48 bg-surface-variant relative overflow-hidden">
      <img
        :src="course.image"
        :alt="course.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <!-- Category badge on image -->
      <div
        class="absolute top-4 left-4 px-3 py-1 rounded-full font-sans text-xs font-medium flex items-center gap-1"
        :class="course.badgeClass"
      >
        <span class="material-symbols-outlined text-[16px]">{{ course.categoryIcon }}</span>
        {{ course.category }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 flex-grow flex flex-col">
      <h3 class="font-newsreader text-[22px] font-medium text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {{ course.title }}
      </h3>
      <p class="font-sans text-sm text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">
        {{ course.description }}
      </p>

      <!-- Footer row -->
      <div class="mt-auto flex items-center justify-between pt-4 border-t border-surface-variant">
        <div class="flex items-center gap-2 text-outline">
          <span class="material-symbols-outlined text-[20px]">schedule</span>
          <span class="font-sans text-xs font-medium">{{ course.duration }}</span>
        </div>
        <button class="text-primary font-sans text-sm font-semibold hover:underline flex items-center gap-1">
          Үзэх
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>

  </div>
</template>
