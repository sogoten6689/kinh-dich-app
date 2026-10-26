import { APP_INFO } from "@kinh-dich/core";
import { useEffect, useRef, useState } from "react";
import { QrCode } from "./QrCode";

/** Nút "Tải app Android" ở đầu trang: mở khung có mã QR (quét bằng điện thoại để cài APK) và link tải trực tiếp. */
export function DownloadMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="download-menu" ref={ref}>
      <button type="button" className="download-btn" aria-expanded={open} aria-controls="download-pop" onClick={() => setOpen((o) => !o)}>
        Tải app Android
      </button>
      {open && (
        <div id="download-pop" className="download-pop" role="dialog" aria-label="Cài app Android">
          <QrCode value={APP_INFO.androidDownload} size={180} label="Mã QR cài app Android" />
          <p>Quét bằng camera điện thoại Android để tải file APK, rồi mở file để cài.</p>
          <a className="download-btn" href={APP_INFO.androidDownload} target="_blank" rel="noreferrer">
            Tải APK trên máy này
          </a>
        </div>
      )}
    </div>
  );
}
