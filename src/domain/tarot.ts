import { z } from "zod";

import type { Topic } from "../content/types";
import { addDays, type DateKey, isValidDateKey } from "./date";

export interface Spread {
  date: DateKey;
  topic: Topic;
  cardIds: readonly [string, string, string];
}

export interface AppState {
  version: 1;
  // 날짜별로 뽑은 오늘의 카드
  daily: Readonly<Record<DateKey, string>>;
  lastSpread: Spread | null;
  // 처음 들어왔을 때 알림 안내를 이미 보여줬는지
  reminderAsked: boolean;
  // 토스 알림 동의를 받았는지 (알림 끄기는 토스 앱 설정에서 해서, 앱에서는 켜기만 기록해요)
  reminderAgreed: boolean;
}

export const DEFAULT_STATE: AppState = {
  version: 1,
  daily: {},
  lastSpread: null,
  reminderAsked: false,
  reminderAgreed: false,
};

const dateKeySchema = z.string().refine(isValidDateKey);
const topicSchema = z.enum(["love", "work", "money", "relationship"]);

const stateSchema = z.object({
  version: z.literal(1),
  daily: z.record(dateKeySchema, z.string()),
  lastSpread: z
    .object({
      date: dateKeySchema,
      topic: topicSchema,
      cardIds: z.tuple([z.string(), z.string(), z.string()]),
    })
    .nullable(),
  reminderAsked: z.boolean(),
  reminderAgreed: z.boolean().default(false),
});

// 저장된 값이 없으면 기본 상태, 깨져 있으면 에러를 내서 덮어쓰지 않게 해요.
export function parseState(raw: string | null): AppState {
  if (raw === null) return DEFAULT_STATE;
  return stateSchema.parse(JSON.parse(raw));
}

export function serializeState(state: AppState): string {
  return JSON.stringify(state);
}

export function pickDistinct(
  ids: readonly string[],
  count: number,
  random: () => number,
): string[] {
  const { picked } = Array.from({ length: count }).reduce<{
    pool: readonly string[];
    picked: readonly string[];
  }>(
    ({ pool, picked }) => {
      const index = Math.floor(random() * pool.length);
      return {
        pool: pool.filter((_, i) => i !== index),
        picked: [...picked, pool[index]],
      };
    },
    { pool: ids, picked: [] },
  );
  return [...picked];
}

// 오늘의 카드는 하루에 한 번만 뽑혀요. 이미 뽑았으면 그 카드를 그대로 돌려줘요.
export function drawDaily(
  state: AppState,
  today: DateKey,
  ids: readonly string[],
  random: () => number,
): { state: AppState; cardId: string; isNew: boolean } {
  const existing = state.daily[today];
  if (existing) return { state, cardId: existing, isNew: false };

  const [cardId] = pickDistinct(ids, 1, random);
  return {
    state: {
      ...state,
      daily: { ...state.daily, [today]: cardId },
    },
    cardId,
    isNew: true,
  };
}

export function drawSpread(
  state: AppState,
  today: DateKey,
  topic: Topic,
  ids: readonly string[],
  random: () => number,
): { state: AppState; spread: Spread } {
  const [past, present, future] = pickDistinct(ids, 3, random);
  const spread: Spread = { date: today, topic, cardIds: [past, present, future] };
  return {
    state: { ...state, lastSpread: spread },
    spread,
  };
}

// 오늘 아직 안 뽑았어도 어제까지 이어졌으면 연속 기록이 살아 있어요.
export function streakDays(daily: Readonly<Record<DateKey, string>>, today: DateKey): number {
  const start = daily[today] ? today : addDays(today, -1);
  let count = 0;
  let day = start;
  while (daily[day]) {
    count += 1;
    day = addDays(day, -1);
  }
  return count;
}
