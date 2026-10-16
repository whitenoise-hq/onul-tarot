export type Suit = "wands" | "cups" | "swords" | "pentacles";

// 고민 타로에서 고르는 주제예요.
export type Topic = "love" | "work" | "money" | "relationship";

// 3장 배열에서 카드가 놓이는 자리예요.
export type SpreadPosition = "past" | "present" | "future";

export interface TarotCard {
  // 메이저는 "major-0"~"major-21", 마이너는 "wands-1"~"wands-14" (11 시종, 12 기사, 13 여왕, 14 왕)
  id: string;
  arcana: "major" | "minor";
  suit: Suit | null;
  number: number;
  nameKo: string;
  nameEn: string;
  keywords: readonly [string, string, string];
  // 카드 그림 속 상징과 그 의미
  symbol: string;
  // 오늘의 카드 풀이. topics 문장은 고민 타로에서도 같이 쓰여서 "오늘" 같은 시간 표현을 넣지 않아요.
  today: {
    overall: string;
    advice: string;
  };
  topics: Record<Topic, string>;
  positions: Record<SpreadPosition, string>;
}
