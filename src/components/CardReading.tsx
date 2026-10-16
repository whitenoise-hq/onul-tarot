import { TOPIC_LABEL } from "../content/deck";
import type { TarotCard, Topic } from "../content/types";
import { TOPIC_ICON } from "./topicIcons";

const TOPIC_ORDER: readonly Topic[] = ["love", "work", "money", "relationship"];

export function CardKeywords({ card }: { card: TarotCard }) {
  return (
    <div className="keywords">
      {card.keywords.map((keyword) => (
        <span key={keyword} className="keyword">
          {keyword}
        </span>
      ))}
    </div>
  );
}

// 오늘의 카드 풀이: 총운 → 오늘의 조언 → 주제별 → 카드 속 상징
export function CardReading({ card }: { card: TarotCard }) {
  return (
    <div className="reading">
      <section className="card reading-block">
        <h2 className="card-title">오늘의 흐름</h2>
        <p className="reading-text">{card.today.overall}</p>
      </section>

      <section className="card reading-block advice">
        <h2 className="card-title">오늘의 조언</h2>
        <p className="advice-text">{card.today.advice}</p>
      </section>

      <section className="card reading-block">
        <h2 className="card-title">주제별 풀이</h2>
        <ul className="topic-list">
          {TOPIC_ORDER.map((topic) => {
            const Icon = TOPIC_ICON[topic];
            return (
              <li key={topic}>
                <span className="topic-icon">
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <strong>{TOPIC_LABEL[topic]}</strong>
                  <p>{card.topics[topic]}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card reading-block">
        <h2 className="card-title">카드 속 상징</h2>
        <p className="reading-text">{card.symbol}</p>
      </section>
    </div>
  );
}
