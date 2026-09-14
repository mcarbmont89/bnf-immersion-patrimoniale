import React from "react";
import { TABS } from "./spaces";

export default function TabBar({ active, onChange }) {
  return (
    <header className="border-b border-white/10 bg-[#0A0D12]">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏛</span>
          <div className="leading-tight">
            <div className="text-white text-sm font-semibold tracking-tight">
              BnF · Studio Sonore Immersif
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#00C4AA]">
              Bibliothèque nationale de France
            </div>
          </div>
        </div>
        <nav className="ml-auto flex items-center gap-1 overflow-x-auto">
          {TABS.map((t, i) => {
            const activeTab = t.id === active;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab
                    ? "bg-[#00C4AA] text-[#0A0D12]"
                    : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                <span className="opacity-50 ml-0.5">{i + 1}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}