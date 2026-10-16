import { BottomSheet, Button } from "@toss/tds-mobile";
import { BellRing } from "lucide-react";

import { REMINDER_TIME_LABEL } from "../config/notification";

interface ReminderSheetProps {
  open: boolean;
  onAgree: () => void;
  onLater: () => void;
}

// 첫 카드를 뽑은 뒤에 한 번만 물어봐요.
export function ReminderSheet({ open, onAgree, onLater }: ReminderSheetProps) {
  return (
    <BottomSheet
      open={open}
      onDimmerClick={onLater}
      header={<BottomSheet.Header>내일 카드도 알려드릴까요?</BottomSheet.Header>}
      cta={
        <div className="sheet-cta sheet-cta-double">
          <Button display="block" size="large" variant="weak" color="dark" onClick={onLater}>
            다음에
          </Button>
          <Button display="block" size="large" onClick={onAgree}>
            알림 받기
          </Button>
        </div>
      }
    >
      <div className="sheet-body">
        <div className="icon-circle">
          <BellRing size={24} strokeWidth={2.2} />
        </div>
        <div>
          <strong>매일 {REMINDER_TIME_LABEL}에 알려드려요</strong>
          <span>하루를 시작할 때 오늘의 카드를 잊지 않고 뽑을 수 있어요.</span>
        </div>
      </div>
    </BottomSheet>
  );
}
