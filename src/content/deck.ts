import { CUPS } from "./cups";
import { MAJOR_ARCANA } from "./major";
import { PENTACLES } from "./pentacles";
import { SWORDS } from "./swords";
import type { SpreadPosition, Suit, TarotCard, Topic } from "./types";
import { WANDS } from "./wands";

export const DECK: readonly TarotCard[] = [...MAJOR_ARCANA, ...WANDS, ...CUPS, ...SWORDS, ...PENTACLES];

export const DECK_IDS: readonly string[] = DECK.map((card) => card.id);

const CARD_BY_ID = new Map(DECK.map((card) => [card.id, card]));

export function getCard(id: string): TarotCard | undefined {
  return CARD_BY_ID.get(id);
}

export const DECK_GROUPS: ReadonlyArray<{ key: "major" | Suit; label: string; cards: readonly TarotCard[] }> = [
  { key: "major", label: "메이저 아르카나", cards: MAJOR_ARCANA },
  { key: "wands", label: "완드", cards: WANDS },
  { key: "cups", label: "컵", cards: CUPS },
  { key: "swords", label: "소드", cards: SWORDS },
  { key: "pentacles", label: "펜타클", cards: PENTACLES },
];

export const TOPICS: ReadonlyArray<{ id: Topic; label: string; description: string }> = [
  { id: "love", label: "연애", description: "마음이 가는 사람, 지금의 관계" },
  { id: "work", label: "일·공부", description: "직장, 시험, 해야 할 일" },
  { id: "money", label: "금전", description: "씀씀이, 저축, 돈 계획" },
  { id: "relationship", label: "인간관계", description: "가족, 친구, 동료" },
];

export const TOPIC_LABEL: Record<Topic, string> = {
  love: "연애",
  work: "일·공부",
  money: "금전",
  relationship: "인간관계",
};

export const POSITIONS: ReadonlyArray<{ id: SpreadPosition; label: string }> = [
  { id: "past", label: "과거" },
  { id: "present", label: "현재" },
  { id: "future", label: "미래" },
];

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];

// 카드 위쪽에 들어가는 번호. 메이저는 로마 숫자, 마이너는 숫자나 인물 이름이에요.
export function cardNumeral(card: TarotCard): string {
  if (card.arcana === "major") return ROMAN[card.number] ?? String(card.number);
  if (card.number === 1) return "ACE";
  if (card.number <= 10) return ROMAN[card.number];
  return ["PAGE", "KNIGHT", "QUEEN", "KING"][card.number - 11];
}
