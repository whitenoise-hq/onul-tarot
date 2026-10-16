// 부채꼴에서 카드를 고를 때의 선택 규칙이에요.
// 한 장만 고르는 경우 다른 카드를 누르면 바꿔 고르고, 여러 장이면 다 고른 뒤에는 먼저 하나를 취소해야 해요.
export function togglePick(picked: readonly number[], index: number, max: number): number[] {
  if (picked.includes(index)) return picked.filter((value) => value !== index);
  if (max === 1) return [index];
  if (picked.length >= max) return [...picked];
  return [...picked, index];
}
