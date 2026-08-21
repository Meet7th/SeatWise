<template>
  <div
    class="relative flex flex-col items-center justify-center rounded-lg border-2 cursor-pointer transition-all select-none"
    :class="[
      seatClasses,
      { 'ring-2 ring-primary-400 ring-offset-1': isSelected },
      { 'ring-2 ring-yellow-400': isTarget },
      { 'opacity-50': seat.disabled },
    ]"
    :style="{ fontSize: `${fontSize}px` }"
    @click="handleClick"
    @contextmenu.prevent="handleContextMenu"
    @dragstart="handleDragStart"
    @dragover.prevent="handleDragOver"
    @drop="handleDrop"
    :draggable="enableDrag && !!seat.studentId"
  >
    <!-- Heatmap overlay -->
    <div
      v-if="heatmapColor"
      class="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
      :style="{ backgroundColor: heatmapColor }"
    />

    <!-- Disabled seat -->
    <template v-if="seat.disabled">
      <div class="text-gray-300 text-xs">禁用</div>
    </template>

    <!-- Empty seat -->
    <template v-else-if="!seat.studentId">
      <div class="text-gray-400 text-xs">{{ seat.seatNumber }}</div>
    </template>

    <!-- Student seat -->
    <template v-else>
      <!-- Pin indicator -->
      <div v-if="isPinned" class="absolute -top-1 -right-1 text-xs">📌</div>

      <!-- Student name -->
      <div
        class="font-medium truncate w-full text-center"
        :class="studentNameClass"
      >
        {{ studentName }}
      </div>

      <!-- Gender indicator -->
      <div v-if="showGender" class="absolute bottom-0.5 right-0.5">
        <span class="text-xs" :class="genderColor">{{ genderIcon }}</span>
      </div>

      <!-- Lunch underline -->
      <div
        v-if="hasLunch"
        class="absolute bottom-0 left-1 right-1 h-0.5 rounded-full"
        :style="{ backgroundColor: lunchUnderlineColor }"
      />

      <!-- No score indicator -->
      <div v-if="!hasScore" class="absolute inset-0 pointer-events-none opacity-10">
        <div class="w-full h-full" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, #94a3b8 2px, #94a3b8 3px);" />
      </div>
    </template>

    <!-- Seat number badge -->
    <div class="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-500">
      {{ seat.seatNumber }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SeatAssignment, StudentProfile } from '@seatwise/shared';

const props = defineProps<{
  seat: SeatAssignment;
  student: StudentProfile | null;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isTarget?: boolean;
  heatmapColor?: string | null;
  fontSize?: number;
  lunchUnderlineColor?: string;
  showGender?: boolean;
  enableDrag?: boolean;
}>();

const emit = defineEmits<{
  click: [seat: SeatAssignment];
  contextmenu: [seat: SeatAssignment, event: MouseEvent];
  dragstart: [seat: SeatAssignment];
  dragend: [];
  drop: [source: SeatAssignment];
}>();

const seatClasses = computed(() => {
  if (props.seat.disabled) return 'bg-gray-100 border-gray-200';
  if (!props.seat.studentId) return 'bg-gray-50 border-gray-200 hover:border-gray-300';

  const gender = props.student?.gender;
  return [
    'bg-white',
    gender === 'male' ? 'border-blue-300' : 'border-pink-300',
    props.isHighlighted ? 'border-primary-400 bg-primary-50' : '',
  ].filter(Boolean).join(' ');
});

const studentName = computed(() => props.student?.name || '');
const isPinned = computed(() => props.student?.pinned || false);
const hasScore = computed(() => props.student?.avgScore !== null && props.student?.avgScore !== undefined);
const hasLunch = computed(() => props.student?.lunch || false);

const studentNameClass = computed(() => {
  const score = props.student?.avgScore;
  if (score === null || score === undefined) return 'text-gray-400';
  return 'text-gray-900';
});

const genderColor = computed(() => {
  return props.student?.gender === 'male' ? 'text-blue-500' : 'text-pink-500';
});

const genderIcon = computed(() => {
  return props.student?.gender === 'male' ? '♂' : '♀';
});

function handleClick() {
  emit('click', props.seat);
}

function handleContextMenu(e: MouseEvent) {
  emit('contextmenu', props.seat, e);
}

function handleDragStart() {
  if (props.enableDrag && props.seat.studentId) {
    emit('dragstart', props.seat);
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
}

function handleDrop() {
  emit('drop', props.seat);
}
</script>
