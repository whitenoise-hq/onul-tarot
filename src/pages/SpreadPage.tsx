import { Button } from "@toss/tds-mobile";
import { Clapperboard } from "lucide-react";
import { type ReactNode, useState } from "react";

import { BackBar } from "../components/BackBar";
import { BannerAd } from "../components/BannerAd";
import { BottomActions } from "../components/BottomActions";
import { CardFan } from "../components/CardFan";
import { PageHeader } from "../components/PageHeader";
import { FlipCard } from "../components/TarotCardView";
import { TopicShortcuts } from "../components/TopicShortcuts";
import { TOPIC_ICON } from "../components/topicIcons";
import { getCard, POSITIONS, TOPIC_LABEL, TOPICS } from "../content/deck";
import type { Topic } from "../content/types";
import { togglePick } from "../domain/pick";
import type { Spread } from "../domain/tarot";
import { useFlipAfterMount } from "../hooks/useFlipAfterMount";

const FAN_SIZE = 9;
const PICK_COUNT = 3;

type Stage = "topic" | "pick" | "result";

interface SpreadPageProps {
  initialTopic: Topic;
  lastSpread: Spread | null;
  needsAd: boolean;
  // 광고를 끝까지 보면 onUnlocked를 불러요. 광고가 없으면 바로 불러요.
  onUnlock: (onUnlocked: () => void) => void;
  onDraw: (topic: Topic) => void;
  onOpenTopic: (topic: Topic) => void;
  onBack: () => void;
}

export function SpreadPage({
  initialTopic,
  lastSpread,
  needsAd,
  onUnlock,
  onDraw,
  onOpenTopic,
  onBack,
}: SpreadPageProps) {
  const backBar = <BackBar label="오늘의 카드" onBack={onBack} />;
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [stage, setStage] = useState<Stage>("topic");

  if (stage === "pick") {
    return (
      <PickThree
        backBar={backBar}
        topic={topic}
        onDone={() => {
          onDraw(topic);
          setStage("result");
        }}
      />
    );
  }
  if (stage === "result" && lastSpread) {
    return <SpreadResult backBar={backBar} spread={lastSpread} onOpenTopic={onOpenTopic} />;
  }

  return (
    <>
      <div className="page">
        {backBar}
        <PageHeader
          title="고민 타로"
          subtitle={
            <>
              고민을 하나 떠올리고 주제를 골라 주세요.
              <br />
              카드 3장으로 과거·현재·미래를 읽어요.
            </>
          }
        />
        <ul className="topic-options">
          {TOPICS.map((option) => {
            const selected = option.id === topic;
            const Icon = TOPIC_ICON[option.id];
            return (
              <li key={option.id}>
                <button
                  type="button"
                  className={`topic-option${selected ? " selected" : ""}`}
                  aria-pressed={selected}
                  onClick={() => setTopic(option.id)}
                >
                  <span className="topic-icon">
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <strong>{option.label}</strong>
                  <span className="topic-description">{option.description}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {needsAd && (
          <p className="ad-note">
            <Clapperboard size={14} strokeWidth={2.2} />
            짧은 광고를 보면 카드 3장을 고를 수 있어요
          </p>
        )}
      </div>
      <BottomActions>
        <Button display="block" size="large" onClick={() => onUnlock(() => setStage("pick"))}>
          카드 3장 고르기
        </Button>
      </BottomActions>
    </>
  );
}

interface PickThreeProps {
  backBar: ReactNode;
  topic: Topic;
  onDone: () => void;
}

function PickThree({ backBar, topic, onDone }: PickThreeProps) {
  const [picked, setPicked] = useState<number[]>([]);
  const isComplete = picked.length === PICK_COUNT;
  const nextLabel = POSITIONS[Math.min(picked.length, PICK_COUNT - 1)].label;

  return (
    <>
      <div className="page">
        {backBar}
        <BannerAd />
        <PageHeader
          title={`${TOPIC_LABEL[topic]} 고민 타로`}
          subtitle={
            <>
              고민을 떠올리며 끌리는 카드를 3장 골라 주세요.
              <br />
              다시 누르면 취소돼요.
            </>
          }
        />
        <div className="card-stage draw-stage">
          <CardFan
            count={FAN_SIZE}
            picked={picked}
            onToggle={(index) => setPicked(togglePick(picked, index, PICK_COUNT))}
          />
          <div className="pick-steps">
            {POSITIONS.map((position, index) => (
              <span key={position.id} className={index < picked.length ? "done" : undefined}>
                {position.label}
              </span>
            ))}
          </div>
          <p className="pick-hint">
            {isComplete ? "이 3장으로 흐름을 읽어 볼게요" : `${nextLabel}를 보여 줄 카드를 골라 주세요`}
          </p>
        </div>
      </div>
      {isComplete && (
        <BottomActions>
          <Button display="block" size="large" onClick={onDone}>
            이 3장으로 볼게요
          </Button>
        </BottomActions>
      )}
    </>
  );
}

interface SpreadResultProps {
  backBar: ReactNode;
  spread: Spread;
  onOpenTopic: (topic: Topic) => void;
}

function SpreadResult({ backBar, spread, onOpenTopic }: SpreadResultProps) {
  const cards = spread.cardIds.map((id) => getCard(id));
  const flipped = useFlipAfterMount(spread.cardIds.join(","), true, 120);

  return (
    <div className="page">
      {backBar}
      <PageHeader title={`${TOPIC_LABEL[spread.topic]} 고민 타로`} subtitle="카드가 보여 주는 흐름을 천천히 읽어 보세요." />
      <div className="spread-row">
        {POSITIONS.map((position, index) => (
          <div key={position.id} className="spread-slot" style={{ transitionDelay: `${index * 180}ms` }}>
            <span className="spread-label">{position.label}</span>
            <FlipCard card={cards[index]} flipped={flipped} size="small" />
          </div>
        ))}
      </div>
      <div className={`reveal${flipped ? " shown" : ""}`}>
        {POSITIONS.map((position, index) => {
          const card = cards[index];
          if (!card) return null;
          return (
            <section key={position.id} className="card reading-block">
              <h2 className="card-title">
                {position.label} · {card.nameKo}
              </h2>
              <p className="reading-text">{card.positions[position.id]}</p>
              <p className="reading-text sub">{card.topics[spread.topic]}</p>
            </section>
          );
        })}
        <TopicShortcuts title="다른 고민도 카드로 볼까요?" exclude={spread.topic} onSelect={onOpenTopic} />
        <p className="disclaimer">재미로 보는 타로예요. 결정은 내 마음이 가장 잘 알아요.</p>
        <BannerAd />
      </div>
    </div>
  );
}
