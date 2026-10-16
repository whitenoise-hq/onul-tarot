import { Button } from "@toss/tds-mobile";
import { Bell, Flame, MoonStar, Share2 } from "lucide-react";
import { type ReactNode, useState } from "react";

import { BannerAd } from "../components/BannerAd";
import { BottomActions } from "../components/BottomActions";
import { CardFan } from "../components/CardFan";
import { CardKeywords, CardReading } from "../components/CardReading";
import { PageHeader } from "../components/PageHeader";
import { TimeGreeting } from "../components/TimeGreeting";
import { FlipCard } from "../components/TarotCardView";
import { TopicShortcuts } from "../components/TopicShortcuts";
import type { TarotCard, Topic } from "../content/types";
import { togglePick } from "../domain/pick";
import { periodOf } from "../domain/timeOfDay";
import { useFlipAfterMount } from "../hooks/useFlipAfterMount";

const FAN_SIZE = 7;

interface TodayPageProps {
  card: TarotCard | undefined;
  streak: number;
  onDraw: () => void;
  onShare: (card: TarotCard) => void;
  onOpenTopic: (topic: Topic) => void;
  // 하단 메뉴가 없어서 알림 설정은 제목 오른쪽 버튼으로 열어요. 없으면 버튼을 숨겨요.
  onOpenReminder?: () => void;
}

export function TodayPage({ card, streak, onDraw, onShare, onOpenTopic, onOpenReminder }: TodayPageProps) {
  const reminderButton = onOpenReminder && (
    <button type="button" className="header-icon-button" aria-label="알림 설정" onClick={onOpenReminder}>
      <Bell size={20} strokeWidth={2.2} />
    </button>
  );
  // 이 화면에서 방금 고른 카드만 뒤집히는 모습을 보여줘요.
  const [justPicked, setJustPicked] = useState(false);
  const handleDraw = () => {
    setJustPicked(true);
    onDraw();
  };

  if (!card) return <PickToday streak={streak} headerAction={reminderButton} onDraw={handleDraw} />;
  return (
    <TodayResult
      card={card}
      streak={streak}
      animate={justPicked}
      headerAction={reminderButton}
      onShare={onShare}
      onOpenTopic={onOpenTopic}
    />
  );
}

interface PickTodayProps {
  streak: number;
  headerAction: ReactNode;
  onDraw: () => void;
}

function PickToday({ streak, headerAction, onDraw }: PickTodayProps) {
  const [picked, setPicked] = useState<number[]>([]);
  const now = new Date();
  const period = periodOf(now.getHours());

  return (
    <>
      <div className="page today">
        <BannerAd />
        <PageHeader icon={MoonStar} action={headerAction} title="오늘의 카드" subtitle="마음을 가라앉히고, 끌리는 카드를 한 장 골라 주세요." />
        <div className="card-stage draw-stage">
          <CardFan count={FAN_SIZE} picked={picked} onToggle={(index) => setPicked(togglePick(picked, index, 1))} />
          <TimeGreeting period={period} now={now} />
          {streak > 0 && (
            <p className="streak-pill">
              <Flame size={16} strokeWidth={2.4} />
              {streak}일째 이어서 뽑고 있어요
            </p>
          )}
        </div>
      </div>
      {picked.length > 0 && (
        <BottomActions>
          <Button display="block" size="large" onClick={onDraw}>
            이 카드로 할게요
          </Button>
        </BottomActions>
      )}
    </>
  );
}

interface TodayResultProps {
  card: TarotCard;
  animate: boolean;
  headerAction: ReactNode;
  streak: number;
  onShare: (card: TarotCard) => void;
  onOpenTopic: (topic: Topic) => void;
}

function TodayResult({ card, streak, animate, headerAction, onShare, onOpenTopic }: TodayResultProps) {
  const flipped = useFlipAfterMount(card.id, animate);

  return (
    <div className="page today">
      <PageHeader
        icon={MoonStar}
        action={headerAction}
        title="오늘의 카드"
        subtitle={streak > 1 ? `${streak}일째 이어서 뽑고 있어요` : "오늘 하루를 비춰 줄 카드예요."}
      />
      <div className="card-stage">
        <FlipCard card={card} flipped={flipped} size="large" />
        <div className={`reveal${flipped ? " shown" : ""}`}>
          <h2 className="card-name">{card.nameKo}</h2>
          <p className="card-en">{card.nameEn}</p>
          <CardKeywords card={card} />
        </div>
      </div>
      <div className={`reveal${flipped ? " shown" : ""}`}>
        <CardReading card={card} />
        <div className="text-actions">
          <button type="button" className="text-action" onClick={() => onShare(card)}>
            <Share2 size={16} strokeWidth={2.2} />
            친구에게 공유하기
          </button>
        </div>
        <TopicShortcuts title="고민이 있다면 카드 3장으로 더 볼까요?" onSelect={onOpenTopic} />
        <p className="disclaimer">재미로 보는 오늘의 카드예요. 새 카드는 내일 뽑을 수 있어요.</p>
        <BannerAd />
      </div>
    </div>
  );
}
