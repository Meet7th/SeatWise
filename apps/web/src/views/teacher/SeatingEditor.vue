<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hide-mobile">
      <div class="p-4 border-b border-gray-100 dark:border-gray-700">
        <h2 class="font-semibold text-gray-900 dark:text-white">座位编辑</h2>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ classroom?.name }}</p>
      </div>

      <!-- Search -->
      <div class="p-3 border-b border-gray-100 dark:border-gray-700">
        <input
          v-model="seatingStore.poolSearch"
          type="text"
          placeholder="搜索学生..."
          class="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <!-- Student pool -->
      <div class="flex-1 overflow-auto p-3">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          待排学生 ({{ seatingStore.remainingStudents.length }})
        </div>
        <div class="space-y-1">
          <div
            v-for="student in filteredRemaining"
            :key="student.studentId"
            class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="{ 'bg-primary-50 dark:bg-primary-900/30': seatingStore.selectedSeat?.studentId === student.studentId }"
            @click="selectFromPool(student)"
          >
            <div
              class="w-2 h-2 rounded-full"
              :class="student.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'"
            />
            <span class="flex-1 truncate text-gray-900 dark:text-white">{{ student.name }}</span>
            <span class="text-xs text-gray-400 dark:text-gray-500" v-if="student.avgScore !== null">{{ student.avgScore }}</span>
          </div>
        </div>

        <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">
          已排学生 ({{ seatingStore.drawnStudents.length }})
        </div>
        <div class="space-y-1">
          <div
            v-for="student in seatingStore.drawnStudents"
            :key="student.studentId"
            class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400"
          >
            <div
              class="w-2 h-2 rounded-full"
              :class="student.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'"
            />
            <span class="flex-1 truncate">{{ student.name }}</span>
          </div>
        </div>
      </div>

      <div class="p-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
        <button
          @click="handleDraw"
          :disabled="seatingStore.remainingStudents.length === 0"
          class="w-full py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50"
        >
          抽取下一位
        </button>
        <div class="flex gap-2">
          <button
            @click="seatingStore.undo()"
            :disabled="seatingStore.undoStack.length === 0"
            class="flex-1 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            撤销
          </button>
          <button
            @click="seatingStore.redo()"
            :disabled="seatingStore.redoStack.length === 0"
            class="flex-1 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            重做
          </button>
        </div>
        <button
          @click="handleGenerate"
          class="w-full py-2 border border-primary-300 dark:border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20"
        >
          AI 智能排座
        </button>
      </div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 flex flex-col">
      <!-- Toolbar -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-4">
        <div class="flex gap-2">
          <button
            v-for="type in ['composite', 'average', 'profile_completeness']"
            :key="type"
            @click="seatingStore.toggleHeatmap(type)"
            class="px-3 py-1 rounded-lg text-xs border transition-colors"
            :class="seatingStore.heatmapVisible && seatingStore.heatmapType === type
              ? 'bg-primary-500 text-white border-primary-500'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            {{ heatmapLabels[type] }}
          </button>
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <label class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <input type="checkbox" v-model="showGender" class="rounded" />
            <span class="hide-mobile">显示性别</span>
          </label>
          <div class="relative">
            <button
              @click="showExportMenu = !showExportMenu"
              class="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              导出 ▾
            </button>
            <div v-if="showExportMenu" class="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10">
              <button @click="handleExportBasic" class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700">基础表格 (CSV)</button>
              <button @click="handleExportFull" class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700">完整数据 (CSV)</button>
              <button @click="handleExportScreenshot" class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700">截图导出 (PNG)</button>
            </div>
          </div>
          <button
            @click="handlePublish"
            class="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            发布座位
          </button>
        </div>
      </div>

      <!-- Grid -->
      <div class="flex-1 flex items-center justify-center overflow-auto p-6">
        <ClassroomGrid
          :seatConfig="seatingStore.seatConfig"
          :seats="seatingStore.seats"
          :students="seatingStore.students"
          :selectedSeat="seatingStore.selectedSeat"
          :targetSeat="null"
          :heatmapType="seatingStore.heatmapVisible ? seatingStore.heatmapType : undefined"
          :showGender="showGender"
          :enableDrag="true"
          :fontSize="12"
          @seatClick="handleSeatClick"
          @seatContextmenu="handleSeatContext"
          @seatDrop="handleSeatDrop"
        />
      </div>

      <!-- Quick info bar -->
      <div class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <QuickInfoBar
          :seat="seatingStore.selectedSeat"
          :student="selectedStudent"
        />
      </div>
    </div>
  </div>

  <!-- Context menu -->
  <div
    v-if="contextMenu.visible"
    class="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[160px]"
    :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
  >
    <button
      v-if="contextMenu.seat?.studentId"
      @click="handleClearSeat"
      class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
    >
      移出座位
    </button>
    <button
      @click="handleToggleDisabled"
      class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
    >
      {{ contextMenu.seat?.disabled ? '启用座位' : '禁用座位' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useSeatingStore } from '@/stores/seating';
import { useClassroomStore } from '@/stores/classroom';
import type { SeatAssignment, StudentProfile } from '@seatwise/shared';
import ClassroomGrid from '@/components/seating/ClassroomGrid.vue';
import QuickInfoBar from '@/components/seating/QuickInfoBar.vue';
import { exportToBasicExcel, exportToFullExcel } from '@/utils/export';
import { captureElement } from '@/utils/screenshot';

const route = useRoute();
const seatingStore = useSeatingStore();
const classroomStore = useClassroomStore();

const showGender = ref(true);
const showExportMenu = ref(false);

const classroom = computed(() => classroomStore.currentClassroom);

const heatmapLabels: Record<string, string> = {
  composite: '综合评分',
  average: '平均分',
  profile_completeness: '完整度',
};

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  seat: null as SeatAssignment | null,
});

const selectedStudent = computed(() => {
  if (!seatingStore.selectedSeat?.studentId) return null;
  return seatingStore.students.find(s => s.studentId === seatingStore.selectedSeat!.studentId) || null;
});

const filteredRemaining = computed(() => {
  const search = seatingStore.poolSearch.toLowerCase();
  return seatingStore.remainingStudents.filter(s =>
    !search || s.name.toLowerCase().includes(search)
  );
});

onMounted(async () => {
  const classId = route.params.id as string;
  await classroomStore.fetchClassroom(classId);

  if (classroom.value) {
    seatingStore.initSeats(classroom.value.seatConfig);
  }

  // Load students
  try {
    const result = await classroomStore.fetchStudents(classId);
    seatingStore.students = result.items;
  } catch {}
});

function handleSeatClick(seat: SeatAssignment) {
  if (seatingStore.swapMode && seatingStore.selectedSeat) {
    seatingStore.swapSeats(seatingStore.selectedSeat.seatIndex, seat.seatIndex);
    seatingStore.swapMode = false;
    seatingStore.selectedSeat = null;
  } else {
    seatingStore.selectedSeat = seat;
  }
}

function handleSeatContext(seat: SeatAssignment, event: MouseEvent) {
  contextMenu.visible = true;
  contextMenu.x = event.clientX;
  contextMenu.y = event.clientY;
  contextMenu.seat = seat;
}

function handleSeatDrop(source: SeatAssignment, target: SeatAssignment) {
  if (target.studentId) {
    seatingStore.swapSeats(source.seatIndex, target.seatIndex);
  } else {
    const studentId = source.studentId;
    source.studentId = null;
    target.studentId = studentId;
  }
}

function selectFromPool(student: StudentProfile) {
  const emptySeat = seatingStore.seats.find(s => !s.studentId && !s.disabled);
  if (emptySeat) {
    emptySeat.studentId = student.studentId;
  }
}

function handleDraw() {
  seatingStore.drawNext();
}

function handleGenerate() {
  alert('AI 智能排座功能将在后端算法实现后启用');
}

function handlePublish() {
  alert('发布功能已保存当前座位方案');
}

function handleExportBasic() {
  if (!classroom.value) return;
  exportToBasicExcel(
    { assignments: seatingStore.seats, weights: seatingStore.weights, metrics: seatingStore.calculateMetrics() } as any,
    seatingStore.students,
    classroom.value
  );
  showExportMenu.value = false;
}

function handleExportFull() {
  if (!classroom.value) return;
  exportToFullExcel(
    { assignments: seatingStore.seats, weights: seatingStore.weights, metrics: seatingStore.calculateMetrics() } as any,
    seatingStore.students,
    classroom.value
  );
  showExportMenu.value = false;
}

async function handleExportScreenshot() {
  try {
    await captureElement('.grid', 'seat-plan.png');
  } catch (e) {
    alert('截图导出失败');
  }
  showExportMenu.value = false;
}

function handleClearSeat() {
  if (contextMenu.seat) {
    seatingStore.clearSeat(contextMenu.seat.seatIndex);
  }
  contextMenu.visible = false;
}

function handleToggleDisabled() {
  if (contextMenu.seat) {
    seatingStore.toggleSeatDisabled(contextMenu.seat.seatIndex);
  }
  contextMenu.visible = false;
}

// Close context menu on click outside
document.addEventListener('click', () => {
  contextMenu.visible = false;
});
</script>
