import { describe, expect, it } from "vitest";

import {
  DEFAULT_STATE,
  drawDaily,
  drawSpread,
  parseState,
  pickDistinct,
  serializeState,
  streakDays,
} from "./tarot";

const IDS = ["a", "b", "c", "d", "e"];

// 항상 같은 순서로 나오는 테스트용 난수
function sequence(...values: number[]): () => number {
  let index = 0;
  return () => values[index++ % values.length];
}

describe("pickDistinct", () => {
  it("겹치지 않게 원하는 개수만큼 뽑아요", () => {
    const picked = pickDistinct(IDS, 3, Math.random);
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
    picked.forEach((id) => expect(IDS).toContain(id));
  });

  it("난수에 따라 정해진 카드를 뽑아요", () => {
    expect(pickDistinct(IDS, 2, sequence(0, 0))).toEqual(["a", "b"]);
    expect(pickDistinct(IDS, 1, sequence(0.99))).toEqual(["e"]);
  });

  it("원래 목록은 바꾸지 않아요", () => {
    const ids = [...IDS];
    pickDistinct(ids, 3, Math.random);
    expect(ids).toEqual(IDS);
  });
});

describe("drawDaily", () => {
  it("오늘 처음 뽑으면 날짜와 함께 카드를 기록해요", () => {
    const { state, cardId, isNew } = drawDaily(DEFAULT_STATE, "2026-10-16", IDS, sequence(0.5));
    expect(cardId).toBe("c");
    expect(isNew).toBe(true);
    expect(state.daily["2026-10-16"]).toBe("c");
    expect(DEFAULT_STATE.daily).toEqual({});
  });

  it("오늘 이미 뽑았으면 같은 카드를 돌려주고 상태는 그대로예요", () => {
    const first = drawDaily(DEFAULT_STATE, "2026-10-16", IDS, sequence(0.5));
    const second = drawDaily(first.state, "2026-10-16", IDS, sequence(0));
    expect(second.cardId).toBe("c");
    expect(second.isNew).toBe(false);
    expect(second.state).toBe(first.state);
  });
});

describe("drawSpread", () => {
  it("서로 다른 3장을 뽑아 주제와 함께 기록해요", () => {
    const { state, spread } = drawSpread(DEFAULT_STATE, "2026-10-16", "love", IDS, sequence(0, 0, 0));
    expect(spread).toEqual({ date: "2026-10-16", topic: "love", cardIds: ["a", "b", "c"] });
    expect(state.lastSpread).toEqual(spread);
  });
});

describe("streakDays", () => {
  it("오늘까지 하루도 빠짐없이 뽑은 날 수를 세요", () => {
    const daily = { "2026-10-14": "a", "2026-10-15": "b", "2026-10-16": "c" };
    expect(streakDays(daily, "2026-10-16")).toBe(3);
  });

  it("오늘 아직 안 뽑았으면 어제까지의 연속 기록을 세요", () => {
    const daily = { "2026-10-14": "a", "2026-10-15": "b" };
    expect(streakDays(daily, "2026-10-16")).toBe(2);
  });

  it("어제도 오늘도 안 뽑았으면 0이에요", () => {
    expect(streakDays({ "2026-10-13": "a" }, "2026-10-16")).toBe(0);
  });
});

describe("parseState / serializeState", () => {
  it("저장한 상태를 그대로 다시 읽어요", () => {
    const { state } = drawSpread(
      drawDaily(DEFAULT_STATE, "2026-10-16", IDS, sequence(0.5)).state,
      "2026-10-16",
      "work",
      IDS,
      sequence(0.1, 0.2, 0.3),
    );
    expect(parseState(serializeState(state))).toEqual(state);
  });

  it("알림 동의 여부가 없던 예전 저장값도 읽어요", () => {
    const old = JSON.stringify({ version: 1, daily: {}, lastSpread: null, reminderAsked: true });
    expect(parseState(old)).toEqual({ ...DEFAULT_STATE, reminderAsked: true, reminderAgreed: false });
  });

  it("저장된 값이 없으면 기본 상태예요", () => {
    expect(parseState(null)).toEqual(DEFAULT_STATE);
  });

  it("형식이 깨진 값이면 에러를 내요", () => {
    expect(() => parseState("{broken")).toThrow();
    expect(() => parseState(JSON.stringify({ version: 1, daily: { nope: "a" } }))).toThrow();
  });
});
