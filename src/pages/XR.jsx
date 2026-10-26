import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import XRViewer from "@/components/xr/XRViewer";

export default function XR() {
  const [params, setParams] = useSearchParams();
  const tour = params.get("tour") || "richelieu";
  const space = Number(params.get("space")) || undefined;
  return (
    <div className="h-screen flex flex-col bg-[#0A0D12] p-3 gap-3">
      <div className="flex items-center justify-between shrink-0">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-[#00C4AA]">
          <ArrowLeft size={14} /> Retour
        </Link>
        <span className="text-[11px] text-[#9CA3AF]">
          Casque : ouvrez cette page dans le navigateur du Quest, puis « Enter VR ».
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <XRViewer
          key={tour}
          tour={tour}
          spaceId={space}
          onSpaceChange={(id) => setParams({ tour, space: String(id) }, { replace: true })}
        />
      </div>
    </div>
  );
}
