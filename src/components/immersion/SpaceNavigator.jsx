import React from "react";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

// prev = space numbered one less (wraps), next = one more (wraps),
// forward = next space that carries a sound archive (the "next highlight").
export default function SpaceNavigator({ spaces, current, onSelect }) {
  const idx = spaces.findIndex((s) => s.id === current);
  const prev = spaces[(idx - 1 + spaces.length) % spaces.length];
  const next = spaces[(idx + 1) % spaces.length];
  const forward =
    spaces.find((s, i) => i > idx && [4, 6].includes(s.id)) ||
    spaces.find((s) => [4, 6].includes(s.id));

  const Btn = ({ space, icon: Icon, label }) => (
    <button
      onClick={() => onSelect(space.id)}
      className="flex items-center gap-2 rounded-lg bg-[#111827] border border-white/10 px-3 py-2 text-left hover:border-[#00C4AA]/60 hover:bg-[#0D1117] transition-colors"
    >
      <Icon size={16} className="text-[#00C4AA] shrink-0" />
      <span className="min-w-0">
        <span className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] leading-none">
          {label}
        </span>
        <span className="block text-xs text-white truncate mt-0.5">{space.name}</span>
      </span>
    </button>
  );

  return (
    <div className="flex flex-wrap items-stretch gap-2">
      <Btn space={prev} icon={ArrowUp} label="Au-dessus" />
      <Btn space={next} icon={ArrowDown} label="En dessous" />
      <Btn space={forward} icon={ArrowRight} label="Suivant" />
    </div>
  );
}