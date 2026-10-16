import { useCallback, useEffect, useState } from "react";

import type { Topic } from "../content/types";

export type Screen = { name: "today" } | { name: "spread"; topic: Topic; key: number };

const TODAY: Screen = { name: "today" };

function isScreen(value: unknown): value is Screen {
  return typeof value === "object" && value !== null && "name" in value;
}

// 화면 이동을 브라우저 기록에 남겨서, 토스의 뒤로가기(제스처·버튼)로 오늘의 카드로 돌아오게 해요.
export function useScreen() {
  const [screen, setScreen] = useState<Screen>(TODAY);

  useEffect(() => {
    const handlePop = (event: PopStateEvent) => {
      const saved: unknown = event.state?.screen;
      setScreen(isScreen(saved) ? saved : TODAY);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  // 고민 타로에서 다른 주제로 넘어갈 때는 기록을 쌓지 않아서, 뒤로가기 한 번이면 오늘의 카드로 돌아와요.
  const openSpread = useCallback((topic: Topic) => {
    setScreen((current) => {
      const next: Screen = { name: "spread", topic, key: Date.now() };
      const historyState = { ...window.history.state, screen: next };
      if (current.name === "spread") window.history.replaceState(historyState, "");
      else window.history.pushState(historyState, "");
      return next;
    });
    window.scrollTo({ top: 0 });
  }, []);

  const goBack = useCallback(() => window.history.back(), []);

  return { screen, openSpread, goBack };
}
