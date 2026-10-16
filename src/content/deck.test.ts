import { describe, expect, it } from "vitest";

import { cardNumeral, DECK, DECK_GROUPS, getCard } from "./deck";

const BANNED_WORDS = /투자|주식|코인|대출|로또|도박|Rider|Waite|라이더|웨이트/;
const TIME_WORDS = /오늘|내일|이번 주/;

describe("DECK", () => {
  it("78장이고 id가 겹치지 않아요", () => {
    expect(DECK).toHaveLength(78);
    expect(new Set(DECK.map((card) => card.id)).size).toBe(78);
  });

  it("메이저 22장, 무늬별 14장이에요", () => {
    expect(DECK_GROUPS.map((group) => group.cards.length)).toEqual([22, 14, 14, 14, 14]);
  });

  it("모든 카드의 풀이 문장이 비어 있지 않아요", () => {
    DECK.forEach((card) => {
      const texts = [
        card.nameKo,
        card.nameEn,
        card.symbol,
        ...card.keywords,
        ...Object.values(card.today),
        ...Object.values(card.topics),
        ...Object.values(card.positions),
      ];
      texts.forEach((text) => expect(text.trim(), card.id).not.toBe(""));
    });
  });

  it("검수에 걸릴 수 있는 단어를 쓰지 않아요", () => {
    DECK.forEach((card) => expect(JSON.stringify(card), card.id).not.toMatch(BANNED_WORDS));
  });

  it("고민 타로에서도 쓰는 문장에는 시간 표현을 넣지 않아요", () => {
    DECK.forEach((card) => {
      [...Object.values(card.topics), ...Object.values(card.positions)].forEach((text) =>
        expect(text, card.id).not.toMatch(TIME_WORDS),
      );
    });
  });
});

describe("cardNumeral", () => {
  it("메이저는 로마 숫자, 마이너는 숫자나 인물 이름이에요", () => {
    expect(cardNumeral(getCard("major-0")!)).toBe("0");
    expect(cardNumeral(getCard("major-21")!)).toBe("XXI");
    expect(cardNumeral(getCard("cups-1")!)).toBe("ACE");
    expect(cardNumeral(getCard("cups-7")!)).toBe("VII");
    expect(cardNumeral(getCard("swords-13")!)).toBe("QUEEN");
  });
});
