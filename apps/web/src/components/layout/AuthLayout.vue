<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
    <div class="w-full max-w-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600 dark:text-primary-400">智座 SeatWise</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">AI 智能排座系统</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <slot />
      </div>
    </div>
  </div>
</template>
