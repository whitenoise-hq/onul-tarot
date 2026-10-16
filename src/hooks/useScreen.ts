import { useCallback, useEffect, useState } from "react";

import type { Topic } from "../content/types";

export type Screen = { name: "today" } | { name: "spread"; topic: Topic; key: number };

const TODAY: Screen = { name: "today" };

// 콘솔 '주요 기능'에 화면 주소로 등록할 수 있게 고민 타로는 /spread 주소를 써요.
export const SPREAD_PATH = "/spread";

function initialScreen(): Screen {
  return window.location.pathname === SPREAD_PATH ? { name: "spread", topic: "love", key: 0 } : TODAY;
}

function isScreen(value: unknown): value is Screen {
  return typeof value === "object" && value !== null && "name" in value;
}

// 화면 이동을 브라우저 기록에 남겨서, 토스의 뒤로가기(제스처·버튼)로 오늘의 카드로 돌아오게 해요.
export function useScreen() {
  const [screen, setScreen] = useState<Screen>(initialScreen);

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
      if (current.name === "spread") window.history.replaceState(historyState, "", SPREAD_PATH);
      else window.history.pushState(historyState, "", SPREAD_PATH);
      return next;
    });
    window.scrollTo({ top: 0 });
  }, []);

  // 고민 타로 주소로 바로 들어온 경우에는 돌아갈 기록이 없어서 오늘의 카드로 바꿔 줘요.
  const goBack = useCallback(() => {
    if (window.history.state?.screen) {
      window.history.back();
      return;
    }
    window.history.replaceState(null, "", "/");
    setScreen(TODAY);
    window.scrollTo({ top: 0 });
  }, []);

  return { screen, openSpread, goBack };
}
