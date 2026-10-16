import { useEffect, useState } from "react";

// 카드가 정해진 다음 한 박자 뒤에 뒤집어서 뒤집히는 모습이 보이게 해요.
// animate가 false면(이미 뽑아 둔 카드를 다시 보는 경우) 처음부터 앞면이에요.
export function useFlipAfterMount(cardId: string | undefined, animate: boolean, delayMs = 80): boolean {
  const [flippedId, setFlippedId] = useState(animate ? undefined : cardId);

  useEffect(() => {
    if (!cardId || cardId === flippedId) return;
    const timer = window.setTimeout(() => setFlippedId(cardId), delayMs);
    return () => window.clearTimeout(timer);
  }, [cardId, flippedId, delayMs]);

  return cardId !== undefined && cardId === flippedId;
}
