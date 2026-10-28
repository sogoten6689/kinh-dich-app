import {
  ABOUT,
  ageInfo,
  CYCLE_THEMES,
  greeting,
  NUMBER_MEANINGS,
  numberLabel,
  numerologyReport,
  parseBirthDate,
  type Profile,
} from "@kinh-dich/core";
import { useState, type FormEvent } from "react";
import { BirthChartGrid } from "./BirthChartGrid";

interface Props {
  profile: Profile | null;
  onSave: (p: Profile) => void;
  onClear: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Thần số học: nhập họ tên + ngày sinh, xem các con số và biểu đồ ngày sinh. */
export function NumerologyView({ profile, onSave, onClear }: Props) {
  const [name, setName] = useState(profile?.name ?? "");
  const [birth, setBirth] = useState(profile ? `${pad(profile.birth.day)}/${pad(profile.birth.month)}/${profile.birth.year}` : "");
  const [error, setError] = useState<string | null>(null);
  const now = new Date();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Bạn cho mình biết họ tên nhé.");
      return;
    }
    const r = parseBirthDate(birth, now);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setError(null);
    onSave({ name: name.trim().replace(/\s+/g, " "), birth: r.date });
  }

  const report = profile ? numerologyReport(profile.name, profile.birth, now) : null;
  const age = profile ? ageInfo(profile.birth, now) : null;
  const life = report ? NUMBER_MEANINGS[report.lifePath]! : null;

  return (
    <div className="numerology">
      <div className="library-head">
        <h2>Thần số học</h2>
        <p>{ABOUT.numerology}</p>
      </div>

      <form className="profile-form" onSubmit={submit} aria-label="Hồ sơ của bạn">
        <label htmlFor="pf-name">
          Họ và tên
          <input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Nguyễn Văn An" autoComplete="name" />
        </label>
        <label htmlFor="pf-birth">
          Ngày sinh (dương lịch)
          <input id="pf-birth" value={birth} onChange={(e) => setBirth(e.target.value)} placeholder="15/08/1990" inputMode="numeric" autoComplete="bday" />
        </label>
        <button type="submit" className="primary">
          {profile ? "Cập nhật" : "Xem thần số học"}
        </button>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <p className="privacy">
          {ABOUT.privacy}{" "}
          {profile && (
            <button type="button" className="link-btn" onClick={onClear}>
              Xóa thông tin đã lưu
            </button>
          )}
        </p>
      </form>

      {profile && report && age && life && (
        <section className="num-result" aria-label="Kết quả thần số học">
          <header className="num-hello">
            <h3>{greeting(profile.name, now)}!</h3>
            <div className="chips">
              <span className="chip">{age.age} tuổi</span>
              <span className="chip">Tuổi mụ {age.lunarAge}</span>
              <span className="chip">
                {age.canChi.name} · con {age.canChi.animal}
              </span>
            </div>
            {age.tetNote && <p className="note-small">{age.tetNote}</p>}
          </header>

          <article className="life-path" aria-label="Số chủ đạo">
            <div className="big-number">
              <small>Số chủ đạo</small>
              <strong>{numberLabel(report.lifePath)}</strong>
            </div>
            <div className="life-text">
              <h3>{life.title}</h3>
              <p>{life.summary}</p>
              <dl>
                <dt>Điểm mạnh</dt>
                <dd>{life.strengths}</dd>
                <dt>Thử thách</dt>
                <dd>{life.challenges}</dd>
                <dt>Công việc hợp</dt>
                <dd>{life.career}</dd>
                <dt>Tình cảm</dt>
                <dd>{life.love}</dd>
              </dl>
            </div>
          </article>

          <div className="num-cards">
            {[
              { label: "Số ngày sinh", hint: "Năng khiếu tự nhiên", n: report.birthDay },
              { label: "Số linh hồn", hint: "Mong muốn bên trong (nguyên âm)", n: report.name.soul },
              { label: "Số nhân cách", hint: "Ấn tượng với người khác (phụ âm)", n: report.name.personality },
              { label: "Số sứ mệnh", hint: "Tài năng và hướng đi (cả họ tên)", n: report.name.expression },
            ].map((c) => (
              <div key={c.label} className="num-card">
                <span className="num-badge">{numberLabel(c.n)}</span>
                <div>
                  <strong>{c.label}</strong>
                  <small>{c.hint}</small>
                  <p>
                    {NUMBER_MEANINGS[c.n]!.title}: {NUMBER_MEANINGS[c.n]!.summary.charAt(0).toLowerCase() + NUMBER_MEANINGS[c.n]!.summary.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="cycle">
            <h3>Chu kỳ của bạn</h3>
            <ul>
              <li>
                <span className="num-badge">{report.cycle.year}</span>
                <span>
                  <strong>Năm cá nhân {now.getFullYear()}</strong>
                  <small>Năm của {CYCLE_THEMES[report.cycle.year]}</small>
                </span>
              </li>
              <li>
                <span className="num-badge">{report.cycle.month}</span>
                <span>
                  <strong>Tháng {now.getMonth() + 1}</strong>
                  <small>Tháng của {CYCLE_THEMES[report.cycle.month]}</small>
                </span>
              </li>
              <li>
                <span className="num-badge">{report.cycle.day}</span>
                <span>
                  <strong>Hôm nay</strong>
                  <small>Ngày của {CYCLE_THEMES[report.cycle.day]}</small>
                </span>
              </li>
            </ul>
          </div>

          <div className="chart-block">
            <div>
              <h3>Biểu đồ ngày sinh</h3>
              <p className="note-small">
                Các chữ số trong {pad(profile.birth.day)}/{pad(profile.birth.month)}/{profile.birth.year} xếp vào lưới 3×3. Đường liền là mũi tên đầy (thế mạnh), đường đứt là
                mũi tên trống (điều cần rèn luyện).
              </p>
              <BirthChartGrid chart={report.chart} />
            </div>
            <ul className="arrows">
              {report.chart.arrows.map((a) => (
                <li key={a.key} className="arrow-full">
                  <strong>
                    {a.name} ({a.key})
                  </strong>
                  <span>{a.meaning}</span>
                </li>
              ))}
              {report.chart.emptyArrows.map((a) => (
                <li key={a.key} className="arrow-empty">
                  <strong>
                    {a.name} ({a.key})
                  </strong>
                  <span>{a.meaning}</span>
                </li>
              ))}
              {report.chart.arrows.length + report.chart.emptyArrows.length === 0 && (
                <li>Biểu đồ của bạn không có mũi tên nào: các nét tính cách khá cân bằng.</li>
              )}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
