import { useState } from "react";
import { CastPanel } from "./components/CastPanel";
import { HexagramList } from "./components/HexagramList";

type Tab = "cast" | "list";

export function App() {
  const [tab, setTab] = useState<Tab>("cast");
  return (
    <div className="app">
      <header>
        <h1>Kinh Dịch</h1>
        <nav>
          <button className={tab === "cast" ? "active" : ""} onClick={() => setTab("cast")}>
            Gieo quẻ
          </button>
          <button className={tab === "list" ? "active" : ""} onClick={() => setTab("list")}>
            64 quẻ
          </button>
        </nav>
      </header>
      <main>{tab === "cast" ? <CastPanel /> : <HexagramList />}</main>
    </div>
  );
}
