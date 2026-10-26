import { glossaryEntry } from "@kinh-dich/core";
import { useId, useState, type ReactNode } from "react";

/** Thuật ngữ có giải thích: bấm vào để mở/đóng lời giải thích. */
export function Term({ k, children }: { k: string; children?: ReactNode }) {
  const entry = glossaryEntry(k);
  const [open, setOpen] = useState(false);
  const id = useId();
  if (!entry) return <>{children}</>;
  return (
    <span className="term">
      <button type="button" className="term-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {children ?? entry.term}
        <span className="term-q" aria-hidden="true">?</span>
      </button>
      {open && (
        <span id={id} role="note" className="term-pop">
          <strong>{entry.term}</strong> — {entry.detail}
        </span>
      )}
    </span>
  );
}
