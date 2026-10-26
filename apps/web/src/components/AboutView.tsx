import { ABOUT, APP_INFO, buildInfoRows, GLOSSARY } from "@kinh-dich/core";
import { webBuildInfo } from "../buildInfo";
import { Logo } from "./Logo";
import { QrCode } from "./QrCode";

export function AboutView() {
  return (
    <div className="about">
      <section className="about-hero">
        <Logo size={72} />
        <div>
          <h2>{APP_INFO.name}</h2>
          <p>{ABOUT.intro}</p>
          <p className="website">
            Trang chính thức:{" "}
            <a href={APP_INFO.website} target="_blank" rel="noreferrer">
              {APP_INFO.website.replace("https://", "")}
            </a>
          </p>
        </div>
      </section>

      <section>
        <h3>Kinh Dịch là gì?</h3>
        {ABOUT.whatIs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      <section>
        <h3>Ứng dụng làm được gì</h3>
        <ul className="feature-list">
          {ABOUT.features.map(([title, text]) => (
            <li key={title}>
              <strong>{title}</strong> {text}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Cách dùng</h3>
        <ol className="howto">
          {ABOUT.howTo.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="disclaimer">{ABOUT.disclaimer}</p>
      </section>

      <section className="download" aria-label="Tải app">
        <h3>Tải app điện thoại</h3>
        <div className="download-body">
          <QrCode value={APP_INFO.androidDownload} label="Mã QR tải app Android" />
          <div>
            <p>Quét mã QR bằng camera điện thoại Android, hoặc bấm nút bên dưới để tải bản APK mới nhất.</p>
            <p>Tải xong, mở file để cài; nếu máy hỏi, cho phép cài ứng dụng từ nguồn này.</p>
            <a className="download-btn" href={APP_INFO.androidDownload} target="_blank" rel="noreferrer">
              Tải app Android (APK)
            </a>
          </div>
        </div>
      </section>

      <section className="author-card" aria-label="Tác giả">
        <div className="avatar" aria-hidden="true">
          LN
        </div>
        <div>
          <p className="eyebrow">Tác giả</p>
          <h3>{APP_INFO.author}</h3>
          <p>{APP_INFO.organization}</p>
        </div>
        <p className="version">Phiên bản {APP_INFO.version}</p>
      </section>

      <section className="build-info" aria-label="Thông tin bản đang chạy">
        <h3>Thông tin bản đang chạy</h3>
        <dl>
          {buildInfoRows(webBuildInfo()).map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h3>Thuật ngữ</h3>
        <dl className="glossary">
          {GLOSSARY.map((g) => (
            <div key={g.key}>
              <dt>
                {g.term} <small>{g.short}</small>
              </dt>
              <dd>{g.detail}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
