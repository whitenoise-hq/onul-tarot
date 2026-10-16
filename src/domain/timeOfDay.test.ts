import { describe, expect, it } from "vitest";

import { formatDateLabel, periodOf } from "./timeOfDay";

describe("periodOf", () => {
  it("시간대를 새벽·아침·낮·저녁·밤으로 나눠요", () => {
    expect(periodOf(0)).toBe("dawn");
    expect(periodOf(4)).toBe("dawn");
    expect(periodOf(5)).toBe("morning");
    expect(periodOf(10)).toBe("morning");
    expect(periodOf(11)).toBe("day");
    expect(periodOf(16)).toBe("day");
    expect(periodOf(17)).toBe("evening");
    expect(periodOf(19)).toBe("evening");
    expect(periodOf(20)).toBe("night");
    expect(periodOf(23)).toBe("night");
  });
});

describe("formatDateLabel", () => {
  it("월 일 요일로 보여줘요", () => {
    expect(formatDateLabel(new Date(2026, 9, 16))).toBe("10월 16일 금요일");
    expect(formatDateLabel(new Date(2026, 0, 4))).toBe("1월 4일 일요일");
  });
});
