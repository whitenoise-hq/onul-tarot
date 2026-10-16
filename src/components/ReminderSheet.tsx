import { BottomSheet, Button } from "@toss/tds-mobile";
import { BellRing } from "lucide-react";

import { REMINDER_TIME_LABEL } from "../config/notification";

interface ReminderSheetProps {
  open: boolean;
  agreed: boolean;
  onAgree: () => void;
  onClose: () => void;
}

// 처음 들어왔을 때 한 번 띄우고, 이후에는 오늘의 카드 오른쪽 위 알림 버튼으로 다시 열어요.
export function ReminderSheet({ open, agreed, onAgree, onClose }: ReminderSheetProps) {
  return (
    <BottomSheet
      open={open}
      onDimmerClick={onClose}
      header={<BottomSheet.Header>{agreed ? "매일 알림을 받고 있어요" : "매일 아침 카드를 알려드릴까요?"}</BottomSheet.Header>}
      cta={
        <div className="sheet-cta sheet-cta-double">
          {agreed ? (
            <Button display="block" size="large" onClick={onClose}>
              확인
            </Button>
          ) : (
            <>
              <Button display="block" size="large" variant="weak" color="dark" onClick={onClose}>
                다음에
              </Button>
              <Button display="block" size="large" onClick={onAgree}>
                알림 받기
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="sheet-body">
        <div className="icon-circle">
          <BellRing size={24} strokeWidth={2.2} />
        </div>
        <div>
          <strong>매일 {REMINDER_TIME_LABEL}에 알려드려요</strong>
          <span>
            {agreed
              ? "알림을 끄고 싶다면 토스 앱의 알림 설정에서 바꿀 수 있어요."
              : "하루를 시작할 때 오늘의 카드를 잊지 않고 뽑을 수 있어요."}
          </span>
        </div>
      </div>
    </BottomSheet>
  );
}
