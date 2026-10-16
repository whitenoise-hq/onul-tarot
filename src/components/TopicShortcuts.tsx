import { ChevronRight } from "lucide-react";

import { TOPICS } from "../content/deck";
import type { Topic } from "../content/types";
import { TOPIC_ICON } from "./topicIcons";

interface TopicShortcutsProps {
  title: string;
  exclude?: Topic;
  onSelect: (topic: Topic) => void;
}

// 결과 화면 아래에서 다른 주제의 타로로 바로 넘어가요.
export function TopicShortcuts({ title, exclude, onSelect }: TopicShortcutsProps) {
  return (
    <section className="card shortcuts">
      <h2 className="card-title">{title}</h2>
      <ul>
        {TOPICS.filter((topic) => topic.id !== exclude).map((topic) => {
          const Icon = TOPIC_ICON[topic.id];
          return (
            <li key={topic.id}>
              <button type="button" className="shortcut" onClick={() => onSelect(topic.id)}>
                <span className={`topic-icon topic-${topic.id}`}>
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <strong>{topic.label} 타로</strong>
                  <span>{topic.description}</span>
                </div>
                <ChevronRight size={20} className="shortcut-arrow" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
