import { APP_INFO, type Profile } from "@kinh-dich/core";
import { useEffect, useState } from "react";
import { AboutView } from "./components/AboutView";
import { BaguaView } from "./components/BaguaView";
import { CastPanel } from "./components/CastPanel";
import { DownloadMenu } from "./components/DownloadMenu";
import { HexagramList } from "./components/HexagramList";
import { Logo } from "./components/Logo";
import { NumerologyView } from "./components/NumerologyView";
import { clearProfile, loadProfile, saveProfile } from "./profileStore";

const TABS = [
  { id: "gieo-que", label: "Gieo quẻ" },
  { id: "than-so", label: "Thần số" },
  { id: "64-que", label: "64 quẻ" },
  { id: "bat-quai", label: "Bát quái" },
  { id: "gioi-thieu", label: "Giới thiệu" },
] as const;

type Tab = (typeof TABS)[number]["id"];

function tabFromHash(): Tab {
  const id = typeof location === "undefined" ? "" : location.hash.slice(1);
  return TABS.some((t) => t.id === id) ? (id as Tab) : "gieo-que";
}

export function App() {
  const [tab, setTab] = useState<Tab>(tabFromHash);
  const [profile, setProfile] = useState<Profile | null>(loadProfile);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function go(id: Tab) {
    setTab(id);
    if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#gieo-que" onClick={() => go("gieo-que")}>
          <Logo />
          <span>
            <strong>{APP_INFO.name}</strong>
            <small>{APP_INFO.tagline}</small>
          </span>
        </a>
        <DownloadMenu />
        <nav aria-label="Chức năng">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? "active" : ""} aria-current={tab === t.id ? "page" : undefined} onClick={() => go(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main>
        {tab === "gieo-que" && <CastPanel profile={profile} onSetupProfile={() => go("than-so")} />}
        {tab === "than-so" && (
          <NumerologyView
            profile={profile}
            onSave={(p) => {
              saveProfile(p);
              setProfile(p);
            }}
            onClear={() => {
              clearProfile();
              setProfile(null);
            }}
          />
        )}
        {tab === "64-que" && <HexagramList />}
        {tab === "bat-quai" && <BaguaView />}
        {tab === "gioi-thieu" && <AboutView />}
      </main>
      <footer className="site-footer">
        {APP_INFO.name} · {APP_INFO.author} — {APP_INFO.organization} · Nội dung mang tính tham khảo văn hóa
      </footer>
    </div>
  );
}
