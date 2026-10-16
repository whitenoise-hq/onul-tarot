// 개발 중(npm run dev)에는 테스트 광고 ID를, 출시 빌드(npm run build)에는 실제 광고 ID를 써요.
// TODO: 콘솔에서 광고 그룹을 만들면 실제 ID로 바꿔요. 그 전까지는 출시 빌드도 테스트 ID예요.
const LIVE_AD_GROUP_IDS = {
  rewarded: "ait-ad-test-rewarded-id",
  banner: "ait-ad-test-banner-id",
} as const;

const TEST_AD_GROUP_IDS = {
  rewarded: "ait-ad-test-rewarded-id",
  banner: "ait-ad-test-banner-id",
} as const;

export const AD_GROUP_IDS = import.meta.env.PROD ? LIVE_AD_GROUP_IDS : TEST_AD_GROUP_IDS;
