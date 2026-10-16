import { describe, expect, it } from "vitest";

import { togglePick } from "./pick";

describe("togglePick", () => {
  it("고르지 않은 카드를 누르면 추가해요", () => {
    expect(togglePick([], 2, 3)).toEqual([2]);
    expect(togglePick([2], 5, 3)).toEqual([2, 5]);
  });

  it("고른 카드를 다시 누르면 취소해요", () => {
    expect(togglePick([2, 5], 2, 3)).toEqual([5]);
  });

  it("한 장만 고를 때는 다른 카드를 누르면 바꿔 골라요", () => {
    expect(togglePick([2], 4, 1)).toEqual([4]);
  });

  it("여러 장을 다 고른 뒤에는 더 추가하지 않아요", () => {
    expect(togglePick([1, 2, 3], 4, 3)).toEqual([1, 2, 3]);
  });

  it("원래 배열은 바꾸지 않아요", () => {
    const picked = [1];
    togglePick(picked, 2, 3);
    expect(picked).toEqual([1]);
  });
});
