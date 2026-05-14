<script setup>
const links = ['Бидний тухай', 'Тусламж', 'Үйлчилгээний нөхцөл', 'Нууцлалын бодлого']
</script>

<template>
  <footer class="w-full py-10 sm:py-12 px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-white border-t border-slate-100">
    <div class="text-xl font-bold text-[#5D8AA8]">PsycheFlow</div>
    <nav class="flex flex-wrap justify-center gap-4 sm:gap-6">
      <a
        v-for="link in links"
        :key="link"
        href="#"
        class="font-newsreader text-sm tracking-wide text-slate-500 hover:text-[#5D8AA8] transition-colors opacity-80 hover:opacity-100"
      >{{ link }}</a>
    </nav>
    <div class="font-newsreader text-sm tracking-wide text-slate-500">
      © 2024 PsycheFlow. Бүх эрх хуулиар хамгаалагдсан.
    </div>
  </footer>
</template>
