<template>
<section
  class="relative min-h-screen w-full flex justify-center items-center bg-cover bg-center bg-no-repeat"
  style="background-image: url('/backgrounds/background1.png')"
>
  <!-- Overlay -->
  <div class="absolute inset-0 bg-black opacity-40"></div>

  <!-- Conteúdo -->
  <div class="relative z-10">
    <slot></slot>
  </div>
</section>

</template>
