<template>
  <div class="flex flex-col items-center gap-1">
    <!-- Column headers -->
    <ColumnHeaders :cols="seatConfig.cols" />

    <!-- Platform left -->
    <div v-if="seatConfig.platformLeft" class="w-full mb-2">
      <PlatformSeat side="left" />
    </div>

    <!-- Seat grid -->
    <div
      class="grid gap-1"
      :style="{
        gridTemplateColumns: `repeat(${seatConfig.cols}, minmax(0, 1fr))`,
      }"
    >
      <template v-for="row in seatConfig.rows" :key="row">
        <template v-for="col in seatConfig.cols" :key="`${row}-${col}`">
          <SeatCell
            :seat="getSeat(row - 1, col - 1)"
            :student="getStudent(getSeat(row - 1, col - 1).studentId)"
            :isSelected="selectedSeat?.seatIndex === getSeat(row - 1, col - 1).seatIndex"
            :isTarget="targetSeat?.seatIndex === getSeat(row - 1, col - 1).seatIndex"
            :heatmapColor="getHeatmapColor(getSeat(row - 1, col - 1).studentId)"
            :fontSize="fontSize"
            :showGender="showGender"
            :enableDrag="enableDrag"
            @click="handleSeatClick"
            @contextmenu="handleContextMenu"
            @dragstart="handleDragStart"
            @drop="handleDrop"
          />
        </template>
      </template>
    </div>

    <!-- Platform right -->
    <div v-if="seatConfig.platformRight" class="w-full mt-2">
      <PlatformSeat side="right" />
    </div>

    <!-- Door indicator -->
    <div v-if="seatConfig.showDoors" class="flex justify-end w-full mt-2">
      <div class="flex items-center gap-1 text-xs text-gray-400">
        <span>🚪</span>
        <span>{{ doorLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SeatAssignment, SeatConfig, StudentProfile } from '@seatwise/shared';
import SeatCell from './SeatCell.vue';
import PlatformSeat from './PlatformSeat.vue';
import ColumnHeaders from './ColumnHeaders.vue';

const props = defineProps<{
  seatConfig: SeatConfig;
  seats: SeatAssignment[];
  students: StudentProfile[];
  selectedSeat: SeatAssignment | null;
  targetSeat: SeatAssignment | null;
  heatmapType?: string;
  showGender?: boolean;
  enableDrag?: boolean;
  fontSize?: number;
}>();

const emit = defineEmits<{
  seatClick: [seat: SeatAssignment];
  seatContextmenu: [seat: SeatAssignment, event: MouseEvent];
  seatDragstart: [seat: SeatAssignment];
  seatDrop: [source: SeatAssignment, target: SeatAssignment];
}>();

const doorLabel = computed(() => {
  const map: Record<string, string> = {
    right: '门(右)',
    left: '门(左)',
  };
  return map[props.seatConfig.doors] || '';
});

function getSeat(row: number, col: number): SeatAssignment {
  const idx = row * props.seatConfig.cols + col;
  return props.seats[idx] || { seatIndex: idx, seatNumber: idx + 1, row, col, type: 'normal', studentId: null, disabled: false };
}

function getStudent(studentId: string | null): StudentProfile | null {
  if (!studentId) return null;
  return props.students.find(s => s.studentId === studentId) || null;
}

function getHeatmapColor(studentId: string | null): string | null {
  if (!props.heatmapType || !studentId) return null;
  const student = getStudent(studentId);
  if (!student) return null;

  switch (props.heatmapType) {
    case 'composite':
      return getScoreColor(student.compositeScore);
    case 'average':
      return getScoreColor(student.avgScore);
    case 'profile_completeness':
      return getScoreColor(student.profileCompleteness);
    default:
      return null;
  }
}

function getScoreColor(score: number | null): string {
  if (score === null) return '#e5e7eb';
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#84cc16';
  if (score >= 40) return '#eab308';
  if (score >= 20) return '#f97316';
  return '#ef4444';
}

function handleSeatClick(seat: SeatAssignment) {
  emit('seatClick', seat);
}

function handleContextMenu(seat: SeatAssignment, event: MouseEvent) {
  emit('seatContextmenu', seat, event);
}

function handleDragStart(seat: SeatAssignment) {
  emit('seatDragstart', seat);
}

function handleDrop(target: SeatAssignment) {
  if (props.selectedSeat) {
    emit('seatDrop', props.selectedSeat, target);
  }
}
</script>
