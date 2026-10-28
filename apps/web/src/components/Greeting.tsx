import { ABOUT, dailyMessage, type Profile } from "@kinh-dich/core";

/** Lời chào ở đầu trang Gieo quẻ: gọi tên và nhắc ngày cá nhân, hoặc mời nhập hồ sơ. */
export function Greeting({ profile, onSetup }: { profile: Profile | null; onSetup: () => void }) {
  if (!profile) {
    return (
      <div className="greeting invite">
        <p>{ABOUT.noProfile}</p>
        <button type="button" className="link-btn" onClick={onSetup}>
          Nhập tên và ngày sinh
        </button>
      </div>
    );
  }
  const m = dailyMessage(profile, new Date());
  return (
    <div className="greeting" aria-label="Lời chào">
      <strong>{m.greeting}!</strong>
      <p>{m.line} Tĩnh tâm, nghĩ về điều bạn muốn hỏi rồi gieo quẻ nhé.</p>
    </div>
  );
}
