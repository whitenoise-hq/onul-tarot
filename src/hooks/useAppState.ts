import { useCallback, useEffect, useRef, useState } from "react";

import { DECK_IDS } from "../content/deck";
import type { Topic } from "../content/types";
import type { DateKey } from "../domain/date";
import {
  type AppState,
  DEFAULT_STATE,
  drawDaily,
  drawSpread,
  parseState,
  serializeState,
  type Spread,
} from "../domain/tarot";
import { loadStateRaw, saveStateRaw } from "../platform/storage";

type LoadStatus = "loading" | "ready" | "error";

interface UseAppStateReturn {
  state: AppState;
  loadStatus: LoadStatus;
  saveError: boolean;
  retryLoad: () => void;
  drawToday: (today: DateKey) => { cardId: string; isNew: boolean };
  drawThree: (today: DateKey, topic: Topic) => Spread;
  markReminderAsked: () => void;
  markReminderAgreed: () => void;
}

export function useAppState(): UseAppStateReturn {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [saveError, setSaveError] = useState(false);
  const stateRef = useRef(state);
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());

  const load = useCallback(() => {
    setLoadStatus("loading");
    loadStateRaw()
      .then((raw) => {
        const loaded = parseState(raw);
        stateRef.current = loaded;
        setState(loaded);
        setLoadStatus("ready");
      })
      .catch(() => setLoadStatus("error"));
  }, []);

  useEffect(load, [load]);

  // 저장 요청을 순서대로 처리해서 오래된 상태가 나중에 덮어쓰지 않게 해요.
  const commit = useCallback((next: AppState) => {
    if (next === stateRef.current) return;
    stateRef.current = next;
    setState(next);
    const serialized = serializeState(next);
    saveChainRef.current = saveChainRef.current
      .then(() => saveStateRaw(serialized))
      .then(() => setSaveError(false))
      .catch(() => setSaveError(true));
  }, []);

  const drawToday = useCallback(
    (today: DateKey) => {
      const { state: next, cardId, isNew } = drawDaily(stateRef.current, today, DECK_IDS, Math.random);
      commit(next);
      return { cardId, isNew };
    },
    [commit],
  );

  const drawThree = useCallback(
    (today: DateKey, topic: Topic) => {
      const { state: next, spread } = drawSpread(stateRef.current, today, topic, DECK_IDS, Math.random);
      commit(next);
      return spread;
    },
    [commit],
  );

  const markReminderAsked = useCallback(
    () => commit({ ...stateRef.current, reminderAsked: true }),
    [commit],
  );

  const markReminderAgreed = useCallback(
    () => commit({ ...stateRef.current, reminderAsked: true, reminderAgreed: true }),
    [commit],
  );

  return { state, loadStatus, saveError, retryLoad: load, drawToday, drawThree, markReminderAsked, markReminderAgreed };
}
