interface StudentData {
  studentId: string;
  gender: string;
  avgScore: number | null;
  personality: string | null;
  specialNeeds: { vision?: string | null } | null;
  socialPreferences: { wantNear?: string[]; avoidNear?: string[] } | null;
  pinned: boolean;
}

interface SeatData {
  seatIndex: number;
  row: number;
  col: number;
  disabled: boolean;
  studentId: string | null;
}

interface Constraints {
  blacklist: string[][];
  whitelist: string[][];
  blacklistPenalty: number;
  blacklistRadius: number;
  genderBalance: boolean;
  honorPinned: boolean;
  honorSpecialNeeds: boolean;
}

export function calculateProbabilities(
  remaining: StudentData[],
  seatedSeats: SeatData[],
  nextSeat: SeatData,
  constraints: Constraints,
  seatConfig: { rows: number; cols: number }
): Map<string, number> {
  const probs = new Map<string, number>();

  for (const student of remaining) {
    let prob = 1.0;

    // 1. Gender balance
    if (constraints.genderBalance) {
      const males = remaining.filter(s => s.gender === 'male').length;
      const total = remaining.length;
      if (total > 0) {
        const maleRatio = males / total;
        if (student.gender === 'male' && maleRatio > 0.6) prob *= 0.7;
        if (student.gender === 'female' && maleRatio < 0.4) prob *= 0.7;
      }
    }

    // 2. Special needs (vision → front rows)
    if (constraints.honorSpecialNeeds && student.specialNeeds?.vision) {
      const frontRows = Math.ceil(seatConfig.rows / 3);
      if (nextSeat.row < frontRows) {
        prob *= 3.0;
      } else {
        prob *= 0.3;
      }
    }

    // 3. Blacklist penalty
    if (constraints.antiCluster !== false) {
      for (const group of constraints.blacklist) {
        const drawnInGroup = group.filter(name =>
          seatedSeats.some(s => s.studentId === name)
        );
        if (drawnInGroup.length === 0) continue;

        for (const drawn of drawnInGroup) {
          const drawnSeat = seatedSeats.find(s => s.studentId === drawn);
          if (!drawnSeat) continue;

          const dist = effectiveDistance(drawnSeat, nextSeat);
          if (dist <= constraints.blacklistRadius) {
            prob *= Math.max(0.001, 1 - constraints.blacklistPenalty / 100);
          }
        }
      }
    }

    // 4. Whitelist bonus
    if (constraints.antiCluster !== false) {
      for (const group of constraints.whitelist) {
        const drawnInGroup = group.filter(name =>
          seatedSeats.some(s => s.studentId === name)
        );
        if (drawnInGroup.length === 0) continue;

        let bestBonus = 0;
        for (const drawn of drawnInGroup) {
          const drawnSeat = seatedSeats.find(s => s.studentId === drawn);
          if (!drawnSeat) continue;

          const rowDiff = Math.abs(drawnSeat.row - nextSeat.row);
          const colDiff = Math.abs(drawnSeat.col - nextSeat.col);
          let bonus = 0;

          if (rowDiff === 0 && colDiff === 1) bonus = constraints.whitelistDeskBonus / 100;
          else if (rowDiff === 1 && colDiff === 0) bonus = constraints.whitelistFrontBackBonus / 100;
          else if (rowDiff === 1 && colDiff === 1) bonus = constraints.whitelistDiagonalBonus / 100;

          bestBonus = Math.max(bestBonus, bonus);
        }

        if (bestBonus > 0) {
          prob *= Math.pow(1 + bestBonus, 3);
        }
      }
    }

    // 5. Social preferences
    if (student.socialPreferences) {
      const wantNear = student.socialPreferences.wantNear || [];
      for (const wantId of wantNear) {
        const wantSeat = seatedSeats.find(s => s.studentId === wantId);
        if (wantSeat) {
          const dist = effectiveDistance(wantSeat, nextSeat);
          if (dist <= 2) prob *= 2.0;
        }
      }

      const avoidNear = student.socialPreferences.avoidNear || [];
      for (const avoidId of avoidNear) {
        const avoidSeat = seatedSeats.find(s => s.studentId === avoidId);
        if (avoidSeat) {
          const dist = effectiveDistance(avoidSeat, nextSeat);
          if (dist <= 2) prob *= 0.2;
        }
      }
    }

    probs.set(student.studentId, Math.max(prob, 0.001));
  }

  // Normalize
  const total = Array.from(probs.values()).reduce((a, b) => a + b, 0);
  if (total > 0) {
    for (const [id, p] of probs) {
      probs.set(id, p / total);
    }
  }

  return probs;
}

function effectiveDistance(seatA: { row: number; col: number }, seatB: { row: number; col: number }): number {
  return Math.abs(seatA.row - seatB.row) + Math.abs(seatA.col - seatB.col);
}

export function weightedRandomSelect(probabilities: Map<string, number>): string {
  const random = Math.random();
  let cumulative = 0;

  for (const [id, prob] of probabilities) {
    cumulative += prob;
    if (random <= cumulative) return id;
  }

  // Fallback
  const keys = Array.from(probabilities.keys());
  return keys[keys.length - 1];
}
