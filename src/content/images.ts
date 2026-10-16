// src/assets/cards/<카드 id>.webp 파일이 있으면 그 그림을 써요. 없는 카드는 기본 카드 디자인으로 보여줘요.
// 예: src/assets/cards/major-0.webp, src/assets/cards/back.webp
const files = import.meta.glob<string>("../assets/cards/*.{webp,png,jpg}", {
  eager: true,
  import: "default",
});

const IMAGE_BY_NAME = new Map(
  Object.entries(files).map(([path, url]) => [path.split("/").pop()!.replace(/\.\w+$/, ""), url]),
);

export function cardImage(id: string): string | undefined {
  return IMAGE_BY_NAME.get(id);
}

export const CARD_BACK_IMAGE = IMAGE_BY_NAME.get("back");
