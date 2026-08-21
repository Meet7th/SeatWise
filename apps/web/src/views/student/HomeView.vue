<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">欢迎回来</h2>

    <!-- Quick actions - mobile friendly cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <router-link
        to="/quiz"
        class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
      >
        <div class="text-3xl mb-3">📝</div>
        <h3 class="font-semibold text-gray-900 dark:text-white">我的测评</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">完成性格测评，获取专属画像</p>
        <div class="mt-3 text-sm text-primary-600 dark:text-primary-400">开始测评 →</div>
      </router-link>

      <router-link
        to="/seat"
        class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
      >
        <div class="text-3xl mb-3">💺</div>
        <h3 class="font-semibold text-gray-900 dark:text-white">我的座位</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">查看当前座位安排</p>
        <div class="mt-3 text-sm text-primary-600 dark:text-primary-400">查看座位 →</div>
      </router-link>

      <router-link
        to="/appeal/new"
        class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
      >
        <div class="text-3xl mb-3">📮</div>
        <h3 class="font-semibold text-gray-900 dark:text-white">申诉反馈</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">对座位安排有意见？提交申诉</p>
        <div class="mt-3 text-sm text-primary-600 dark:text-primary-400">提交申诉 →</div>
      </router-link>
    </div>

    <!-- Recent notifications -->
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">最近通知</h3>
      <div class="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
        暂无新通知
      </div>
    </div>
  </div>
</template>
