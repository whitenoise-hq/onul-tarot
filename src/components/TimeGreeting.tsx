import { type LucideIcon, Moon, MoonStar, Sun, Sunrise, Sunset } from "lucide-react";

import { formatDateLabel, type Period } from "../domain/timeOfDay";

const GREETING: Record<Period, { Icon: LucideIcon; label: string; message: string }> = {
  dawn: { Icon: MoonStar, label: "새벽", message: "고요한 새벽이에요\n마음이 가는 카드를 골라 보세요" },
  morning: { Icon: Sunrise, label: "아침", message: "좋은 아침이에요\n오늘을 열어 줄 카드를 골라 보세요" },
  day: { Icon: Sun, label: "오후", message: "바쁜 하루 중 잠깐\n숨을 고르고 카드를 골라 보세요" },
  evening: { Icon: Sunset, label: "저녁", message: "수고한 하루를 돌아보며\n카드를 골라 보세요" },
  night: { Icon: Moon, label: "밤", message: "하루를 마무리하며\n카드 한 장을 골라 보세요" },
};

interface TimeGreetingProps {
  period: Period;
  now: Date;
}

// 카드 고르는 화면 아래에 시간대 아이콘·날짜·문구를 보여줘요.
export function TimeGreeting({ period, now }: TimeGreetingProps) {
  const { Icon, label, message } = GREETING[period];
  return (
    <div className={`time-greeting period-${period}`}>
      <span className="time-icon">
        <Icon size={26} strokeWidth={1.8} />
      </span>
      <strong>
        {formatDateLabel(now)} {label}
      </strong>
      <p>{message}</p>
    </div>
  );
}
