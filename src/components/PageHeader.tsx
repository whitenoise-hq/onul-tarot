import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: LucideIcon;
}

// TDS Top은 제목이 22px부터라, 더 작은 제목을 쓰려고 직접 만든 헤더예요.
export function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1>
        {Icon && <Icon className="page-header-icon" size={20} strokeWidth={2.2} aria-hidden />}
        {title}
      </h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}
