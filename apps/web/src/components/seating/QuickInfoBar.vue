<template>
  <div class="flex items-center gap-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
    <div v-if="student" class="flex items-center gap-2">
      <div
        class="w-3 h-3 rounded-full"
        :class="student.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'"
      />
      <span class="font-medium text-gray-900">{{ student.name }}</span>
      <span v-if="student.pinned" class="text-xs">📌</span>
    </div>
    <div v-if="student?.avgScore !== null && student?.avgScore !== undefined" class="text-gray-500">
      均分: <span class="font-medium text-gray-700">{{ student.avgScore }}</span>
    </div>
    <div v-if="student?.personality" class="text-gray-500">
      性格: <span class="font-medium text-gray-700">{{ student.personality }}</span>
    </div>
    <div v-if="seat" class="text-gray-400 ml-auto">
      {{ seat.seatNumber }}号座 ({{ seat.row + 1 }}排{{ seat.col + 1 }}列)
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SeatAssignment, StudentProfile } from '@seatwise/shared';

defineProps<{
  seat: SeatAssignment | null;
  student: StudentProfile | null;
}>();
</script>
