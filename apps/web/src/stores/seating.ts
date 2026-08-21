import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SeatAssignment, SeatPlan, SeatConfig, StudentProfile, EvalWeights, SeatConstraints, PlanMetrics } from '@seatwise/shared';

interface UndoAction {
  type: 'swap' | 'assign' | 'clear' | 'disable';
  data: unknown;
}

export const useSeatingStore = defineStore('seating', () => {
  // Current plan
  const currentPlan = ref<SeatPlan | null>(null);
  const candidatePlans = ref<SeatPlan[]>([]);
  const selectedPlanIndex = ref(0);

  // Classroom config
  const seatConfig = ref<SeatConfig>({
    rows: 7, cols: 11,
    platformLeft: true, platformRight: true,
    doors: 'right', numberingMode: 'horizontal-snake', showDoors: true,
  });
  const seats = ref<SeatAssignment[]>([]);
  const students = ref<StudentProfile[]>([]);

  // Draw state
  const drawOrder = ref<SeatAssignment[]>([]);
  const currentDrawIndex = ref(0);

  // Constraints
  const blacklist = ref<string[][]>([]);
  const whitelist = ref<string[][]>([]);
  const constraints = ref<SeatConstraints>({
    blacklist: [], whitelist: [],
    blacklistPenalty: 95, blacklistRadius: 2,
    whitelistDeskBonus: 200, whitelistFrontBackBonus: 120,
    whitelistDiagonalBonus: 60, whitelistFallbackBonus: 150,
    genderBalance: true, antiCluster: true,
    honorPinned: true, honorSpecialNeeds: true,
  });

  // UI state
  const selectedSeat = ref<SeatAssignment | null>(null);
  const swapMode = ref(false);
  const batchMode = ref(false);
  const batchSeats = ref<SeatAssignment[]>([]);
  const heatmapVisible = ref(false);
  const heatmapType = ref<'composite' | 'average' | 'subject' | 'personality' | 'profile_completeness'>('composite');
  const poolFilter = ref('all');
  const poolSearch = ref('');

  // Weights
  const weights = ref<EvalWeights>({
    academic: 60, personality: 15, hobby: 10, position: 10, gender: 5, specialNeeds: 20, socialPreference: 15,
  });

  // History
  const undoStack = ref<UndoAction[]>([]);
  const redoStack = ref<UndoAction[]>([]);

  // Computed
  const drawnStudents = computed(() =>
    students.value.filter(s => seats.value.some(seat => seat.studentId === s.studentId))
  );

  const remainingStudents = computed(() => {
    const drawn = new Set(seats.value.filter(s => s.studentId).map(s => s.studentId));
    return students.value.filter(s => !drawn.has(s.studentId) && (!constraints.value.honorPinned || !s.pinned));
  });

  // Initialize seats
  function initSeats(config: SeatConfig) {
    seatConfig.value = config;
    const newSeats: SeatAssignment[] = [];
    let seatNumber = 1;

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        let type: 'normal' | 'platform-left' | 'platform-right' = 'normal';
        if (col === 0 && config.platformLeft) type = 'platform-left';
        if (col === config.cols - 1 && config.platformRight) type = 'platform-right';

        newSeats.push({
          seatIndex: row * config.cols + col,
          seatNumber: seatNumber++,
          row, col, type,
          studentId: null,
          disabled: type !== 'normal',
        });
      }
    }

    seats.value = newSeats;
  }

  // Draw next student
  function drawNext(): StudentProfile | null {
    const remaining = remainingStudents.value;
    if (remaining.length === 0) return null;

    const student = remaining[Math.floor(Math.random() * remaining.length)];
    const emptySeat = seats.value.find(s => !s.studentId && !s.disabled);
    if (emptySeat) {
      pushUndo({ type: 'assign', data: { seatIndex: emptySeat.seatIndex, studentId: null } });
      emptySeat.studentId = student.studentId;
    }
    return student;
  }

  // Swap seats
  function swapSeats(indexA: number, indexB: number) {
    const seatA = seats.value.find(s => s.seatIndex === indexA);
    const seatB = seats.value.find(s => s.seatIndex === indexB);
    if (!seatA || !seatB) return;

    pushUndo({ type: 'swap', data: { indexA, indexB, studentA: seatA.studentId, studentB: seatB.studentId } });
    const temp = seatA.studentId;
    seatA.studentId = seatB.studentId;
    seatB.studentId = temp;
  }

  // Clear seat
  function clearSeat(seatIndex: number) {
    const seat = seats.value.find(s => s.seatIndex === seatIndex);
    if (seat) {
      pushUndo({ type: 'clear', data: { seatIndex, studentId: seat.studentId } });
      seat.studentId = null;
    }
  }

  // Disable/enable seat
  function toggleSeatDisabled(seatIndex: number) {
    const seat = seats.value.find(s => s.seatIndex === seatIndex);
    if (seat) {
      pushUndo({ type: 'disable', data: { seatIndex, disabled: seat.disabled } });
      seat.disabled = !seat.disabled;
      if (seat.disabled) seat.studentId = null;
    }
  }

  // Undo/Redo
  function pushUndo(action: UndoAction) {
    undoStack.value.push(action);
    redoStack.value = [];
  }

  function undo() {
    const action = undoStack.value.pop();
    if (!action) return;
    redoStack.value.push(action);
    applyUndo(action);
  }

  function redo() {
    const action = redoStack.value.pop();
    if (!action) return;
    undoStack.value.push(action);
    applyRedo(action);
  }

  function applyUndo(action: UndoAction) {
    const data = action.data as Record<string, unknown>;
    switch (action.type) {
      case 'swap': {
        const seatA = seats.value.find(s => s.seatIndex === data.indexA);
        const seatB = seats.value.find(s => s.seatIndex === data.indexB);
        if (seatA && seatB) {
          seatA.studentId = data.studentA as string | null;
          seatB.studentId = data.studentB as string | null;
        }
        break;
      }
      case 'assign':
      case 'clear': {
        const seat = seats.value.find(s => s.seatIndex === data.seatIndex);
        if (seat) seat.studentId = data.studentId as string | null;
        break;
      }
      case 'disable': {
        const seat = seats.value.find(s => s.seatIndex === data.seatIndex);
        if (seat) seat.disabled = data.disabled as boolean;
        break;
      }
    }
  }

  function applyRedo(action: UndoAction) {
    const data = action.data as Record<string, unknown>;
    switch (action.type) {
      case 'swap': {
        const seatA = seats.value.find(s => s.seatIndex === data.indexA);
        const seatB = seats.value.find(s => s.seatIndex === data.indexB);
        if (seatA && seatB) {
          const temp = seatA.studentId;
          seatA.studentId = seatB.studentId;
          seatB.studentId = temp;
        }
        break;
      }
      case 'assign': {
        const seat = seats.value.find(s => s.seatIndex === data.seatIndex);
        if (seat) seat.studentId = data.studentId as string;
        break;
      }
      case 'clear': {
        const seat = seats.value.find(s => s.seatIndex === data.seatIndex);
        if (seat) seat.studentId = null;
        break;
      }
      case 'disable': {
        const seat = seats.value.find(s => s.seatIndex === data.seatIndex);
        if (seat) {
          seat.disabled = !seat.disabled;
          if (seat.disabled) seat.studentId = null;
        }
        break;
      }
    }
  }

  function toggleHeatmap(type?: string) {
    if (type) heatmapType.value = type as typeof heatmapType.value;
    heatmapVisible.value = !heatmapVisible.value;
  }

  function calculateMetrics(): PlanMetrics {
    const assignedSeats = seats.value.filter(s => s.studentId);
    const assignedStudents = assignedSeats.map(s => students.value.find(st => st.studentId === s.studentId)).filter(Boolean);

    // Academic balance: variance of avg scores
    const scores = assignedStudents.map(s => s?.avgScore || 50);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length || 50;
    const variance = scores.reduce((a, b) => a + (b - avgScore) ** 2, 0) / scores.length;
    const academicBalance = Math.max(0, 100 - variance / 10);

    // Gender balance
    const males = assignedStudents.filter(s => s?.gender === 'male').length;
    const genderBalance = assignedStudents.length > 0
      ? 100 - Math.abs(males / assignedStudents.length - 0.5) * 200
      : 100;

    // Personality compatibility (simplified)
    const personalityCompatibility = 70;

    // Constraint satisfaction
    const constraintSatisfaction = 85;

    // Special needs satisfaction
    const specialNeedsSatisfaction = 90;

    const overallScore = Math.round(
      academicBalance * 0.3 +
      personalityCompatibility * 0.2 +
      genderBalance * 0.15 +
      constraintSatisfaction * 0.2 +
      specialNeedsSatisfaction * 0.15
    );

    return {
      academicBalance: Math.round(academicBalance),
      personalityCompatibility,
      genderBalance: Math.round(genderBalance),
      constraintSatisfaction,
      specialNeedsSatisfaction,
      overallScore,
    };
  }

  return {
    currentPlan, candidatePlans, selectedPlanIndex,
    seatConfig, seats, students,
    drawOrder, currentDrawIndex,
    blacklist, whitelist, constraints,
    selectedSeat, swapMode, batchMode, batchSeats,
    heatmapVisible, heatmapType,
    poolFilter, poolSearch,
    weights,
    undoStack, redoStack,
    drawnStudents, remainingStudents,
    initSeats, drawNext, swapSeats, clearSeat, toggleSeatDisabled,
    undo, redo, toggleHeatmap, calculateMetrics,
  };
});
