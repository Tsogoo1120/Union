<template>
  <section class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop mb-[120px] flex flex-col md:flex-row items-center gap-12">

    <!-- Text -->
    <div class="flex-1 space-y-6">
      <span class="reveal inline-block px-4 py-2 rounded-full bg-[#F0F4F0] text-secondary font-sans text-xs font-medium">
        Сэтгэл судлал · Боловсрол
      </span>

      <h1 class="reveal reveal-delay-1 font-newsreader text-4xl sm:text-5xl font-semibold leading-tight text-on-surface">
        Сэтгэл зүйгээ таньж мэд
      </h1>

      <p class="reveal reveal-delay-2 font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-xl">
        Өөрийгөө таних аяллаа эхлүүл. Шинжлэх ухаанд суурилсан аргуудаар дамжуулан сэтгэцийн эрүүл мэндээ сайжруулж, илүү тайван амьдралыг цогцлоорой.
      </p>

      <div class="reveal reveal-delay-3 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
        <button class="bg-primary text-on-primary px-6 py-3 rounded-lg font-sans text-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-[0_4px_12px_rgba(50,97,125,0.2)] flex items-center gap-2">
          Аяллаа эхлэх
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <button class="border border-secondary text-secondary px-6 py-3 rounded-lg font-sans text-sm font-semibold hover:bg-secondary-container/20 transition-all duration-200">
          Илүү ихийг мэдэх
        </button>
      </div>
    </div>

    <!-- Image -->
    <div class="reveal flex-1 relative w-full h-[340px] sm:h-[500px] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(93,138,168,0.12)]">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHzINcTZimmZhdwbxLFHMjn-4_sWE5tCqC2yRRGAWV7lChu6WVQkaPP46tPSk4Oib4OI69_UIYKAyDl_eU4QCcAdolLGPf8MG6hqAxZ6t-d85sD27tB1ZtBbExhWfzOCwNCWakITob-xcqetdUvUhmaqIBet-L_t_HKkjU8U-gLZirbPFrkE0tdCZE7wepB_QQEApuXwwScArDIQBF2uBlNesuHoqRitoHktFy0z39QiSmh5CjlW29Ln_gESJk_IA25UWU3FgcoT0"
        alt="Woman meditating by a calm lake at sunrise with soft golden light and gentle mist"
        class="w-full h-full object-cover"
      />
    </div>

  </section>
</template>
