import { Coins, Flame, type LucideIcon, MoonStar, Sparkles, Sword, Wine } from "lucide-react";

import { cardNumeral } from "../content/deck";
import { CARD_BACK_IMAGE, cardImage } from "../content/images";
import type { TarotCard } from "../content/types";

const SUIT_ICON: Record<string, LucideIcon> = {
  major: Sparkles,
  wands: Flame,
  cups: Wine,
  swords: Sword,
  pentacles: Coins,
};

type CardSize = "small" | "medium" | "large";

interface CardFaceProps {
  card: TarotCard;
  size?: CardSize;
}

// 카드 그림이 준비되기 전에는 번호·무늬 아이콘·이름으로 된 기본 디자인을 보여줘요.
export function CardFace({ card, size = "medium" }: CardFaceProps) {
  const image = cardImage(card.id);
  if (image) {
    // 그림 위에 금색 테두리를 안쪽으로 겹쳐 그려요 (.tarot-image::after)
    return (
      <div className={`tarot-card tarot-image ${size}`}>
        <img src={image} alt={card.nameKo} draggable={false} />
      </div>
    );
  }
  const Icon = SUIT_ICON[card.suit ?? "major"];
  return (
    <div className={`tarot-card tarot-face ${size}`} role="img" aria-label={card.nameKo}>
      <span className="tarot-numeral">{cardNumeral(card)}</span>
      <Icon className="tarot-icon" strokeWidth={1.4} />
      <span className="tarot-name">{card.nameKo}</span>
    </div>
  );
}

export function CardBack({ size = "medium" }: { size?: CardSize }) {
  if (CARD_BACK_IMAGE) {
    return <img className={`tarot-card ${size}`} src={CARD_BACK_IMAGE} alt="카드 뒷면" draggable={false} />;
  }
  return (
    <div className={`tarot-card tarot-back ${size}`} role="img" aria-label="카드 뒷면">
      <MoonStar className="tarot-icon" strokeWidth={1.4} />
    </div>
  );
}

interface FlipCardProps {
  card: TarotCard | undefined;
  flipped: boolean;
  size?: CardSize;
}

// 뒷면에서 앞면으로 뒤집히는 카드. 카드가 정해지기 전에는 뒷면만 보여요.
export function FlipCard({ card, flipped, size = "medium" }: FlipCardProps) {
  return (
    <div className={`flip-card ${size}${flipped && card ? " flipped" : ""}`}>
      <div className="flip-inner">
        <div className="flip-side flip-back">
          <CardBack size={size} />
        </div>
        <div className="flip-side flip-front">{card && <CardFace card={card} size={size} />}</div>
      </div>
    </div>
  );
}
