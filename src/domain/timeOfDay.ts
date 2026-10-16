// 앱을 연 시간대. 아침 알림을 받고 들어오면 해가 떠 있는 화면을 보여줘요.
export type Period = "dawn" | "morning" | "day" | "evening" | "night";

export function periodOf(hour: number): Period {
  if (hour < 5) return "dawn";
  if (hour < 11) return "morning";
  if (hour < 17) return "day";
  if (hour < 20) return "evening";
  return "night";
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatDateLabel(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;
}
