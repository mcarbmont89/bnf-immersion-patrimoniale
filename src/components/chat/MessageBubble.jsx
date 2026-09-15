import React from "react";

export default function MessageBubble({ role, text }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#00C4AA] text-[#0A0D12] px-4 py-2 text-sm">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#111827] border border-white/10 px-4 py-3 text-sm text-white/90 whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-sm bg-[#111827] border border-white/10 px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-[#00C4AA] animate-bounce [animation-delay:-0.2s]" />
        <span className="w-2 h-2 rounded-full bg-[#00C4AA] animate-bounce [animation-delay:-0.1s]" />
        <span className="w-2 h-2 rounded-full bg-[#00C4AA] animate-bounce" />
      </div>
    </div>
  );
}