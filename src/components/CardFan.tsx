import { CardBack } from "./TarotCardView";

interface CardFanProps {
  count: number;
  picked: readonly number[];
  onToggle: (index: number) => void;
}

const SPREAD_DEGREES = 30;
// 카드가 많아도 화면 폭(약 335px)을 넘지 않게 간격을 줄여요.
const MAX_GAP_PX = 28;
const MAX_WIDTH_PX = 170;

// 뒷면 카드를 부채꼴로 펼쳐 두고, 마음이 가는 카드를 고르게 해요. 고른 카드를 다시 누르면 취소돼요.
export function CardFan({ count, picked, onToggle }: CardFanProps) {
  const middle = (count - 1) / 2;
  const gap = Math.min(MAX_GAP_PX, MAX_WIDTH_PX / Math.max(count - 1, 1));

  return (
    <div className="card-fan" role="group" aria-label="카드 고르기">
      {Array.from({ length: count }, (_, index) => {
        const offset = index - middle;
        const angle = (offset / Math.max(middle, 1)) * (SPREAD_DEGREES / 2);
        const isPicked = picked.includes(index);
        return (
          <button
            key={index}
            type="button"
            className={`fan-card${isPicked ? " picked" : ""}`}
            style={{
              transform: `translateX(${offset * gap}px) translateY(${Math.abs(offset) * 6 - (isPicked ? 28 : 0)}px) rotate(${angle}deg)`,
              zIndex: index,
            }}
            aria-pressed={isPicked}
            aria-label={`${index + 1}번째 카드`}
            onClick={() => onToggle(index)}
          >
            <CardBack size="small" />
          </button>
        );
      })}
    </div>
  );
}
