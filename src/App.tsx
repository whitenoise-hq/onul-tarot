import { Button, useToast } from "@toss/tds-mobile";

import "./App.css";
import { ReminderSheet } from "./components/ReminderSheet";
import { AD_GROUP_IDS } from "./config/ads";
import { IS_REMINDER_READY, REMINDER_TIME_LABEL } from "./config/notification";
import { getCard } from "./content/deck";
import type { TarotCard } from "./content/types";
import { streakDays } from "./domain/tarot";
import { periodOf } from "./domain/timeOfDay";
import { useAppState } from "./hooks/useAppState";
import { useFullScreenAd } from "./hooks/useFullScreenAd";
import { useScreen } from "./hooks/useScreen";
import { useToday } from "./hooks/useToday";
import { SpreadPage } from "./pages/SpreadPage";
import { TodayPage } from "./pages/TodayPage";
import { isInToss } from "./platform/env";
import { requestReminderAgreement } from "./platform/notification";
import { shareText } from "./platform/share";

function App() {
  const { state, loadStatus, saveError, retryLoad, drawToday, drawThree, markReminderAsked } = useAppState();
  const today = useToday();
  // 하단 탭 없이 오늘의 카드 한 화면에서 시작하고, 바로가기로 고민 타로에 들어가요.
  const { screen, openSpread, goBack } = useScreen();
  const rewarded = useFullScreenAd(AD_GROUP_IDS.rewarded);
  const toast = useToast();
  // 하단은 버튼이 차지해서 토스트는 상단에 띄워요.
  const notify = (message: string) => toast.openToast(message, { type: "top", gap: 16 });

  if (loadStatus === "loading") return <div className="loading">불러오는 중이에요</div>;
  if (loadStatus === "error") {
    return (
      <div className="loading">
        <p>기록을 불러오지 못했어요.</p>
        <Button size="medium" variant="weak" onClick={retryLoad}>
          다시 시도
        </Button>
      </div>
    );
  }

  const todayCardId = state.daily[today];
  const todayCard = todayCardId ? getCard(todayCardId) : undefined;
  // 광고를 불러오지 못했을 때는 기다리게 하지 않고 바로 뽑아 줘요. (보상은 광고를 끝까지 봤을 때만)
  // 개발 도구의 가짜 광고는 보상 이벤트를 주지 않아서, 개발 중(npm run dev)에는 광고 없이 열어요.
  const needsAd = import.meta.env.PROD && isInToss() && rewarded.isReady;

  const handleUnlockSpread = (onUnlocked: () => void) => {
    if (needsAd) rewarded.show({ onReward: onUnlocked });
    else onUnlocked();
  };

  // 시트를 먼저 닫고 토스 알림 동의 화면을 띄워요.
  const handleRequestReminder = () => {
    markReminderAsked();
    requestReminderAgreement().then((result) => {
      if (result === "agreed") notify(`매일 ${REMINDER_TIME_LABEL}에 알려드릴게요`);
      else if (result === "unavailable") notify("토스 앱에서만 알림을 설정할 수 있어요");
    });
  };

  const handleShare = (card: TarotCard) =>
    shareText(`오늘 뽑은 타로 카드: ${card.nameKo}\n${card.today.advice}\n\n토스 '오늘 타로'에서 나도 한 장 뽑아 보기`).catch(() =>
      notify("공유하지 못했어요. 다시 시도해 주세요."),
    );

  return (
    <div className="app" data-period={periodOf(new Date().getHours())}>
      {saveError && <div className="card save-error">기록을 저장하지 못했어요. 앱을 다시 열어 주세요.</div>}
      {screen.name === "today" && (
        <TodayPage
          card={todayCard}
          streak={streakDays(state.daily, today)}
          onDraw={() => drawToday(today)}
          onShare={handleShare}
          onOpenTopic={openSpread}
        />
      )}
      {screen.name === "spread" && (
        <SpreadPage
          key={screen.key}
          initialTopic={screen.topic}
          lastSpread={state.lastSpread}
          needsAd={needsAd}
          onUnlock={handleUnlockSpread}
          onDraw={(topic) => drawThree(today, topic)}
          onOpenTopic={openSpread}
          onBack={goBack}
        />
      )}
      <ReminderSheet
        open={IS_REMINDER_READY && !state.reminderAsked && todayCard !== undefined}
        onAgree={handleRequestReminder}
        onLater={markReminderAsked}
      />
    </div>
  );
}

export default App;
