import { describe, expect, it } from "vitest";

import { DECK } from "./deck";
import { cardImage } from "./images";

describe("cardImage", () => {
  it("78장 모두 카드 그림이 있어요", () => {
    const missing = DECK.filter((card) => !cardImage(card.id)).map((card) => card.id);
    expect(missing).toEqual([]);
  });
});
