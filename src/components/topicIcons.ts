import { Briefcase, Heart, type LucideIcon, Users, Wallet } from "lucide-react";

import type { Topic } from "../content/types";

export const TOPIC_ICON: Record<Topic, LucideIcon> = {
  love: Heart,
  work: Briefcase,
  money: Wallet,
  relationship: Users,
};
