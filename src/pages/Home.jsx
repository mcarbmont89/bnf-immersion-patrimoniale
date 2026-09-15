import React, { useState } from "react";
import TabBar from "@/components/immersion/TabBar";
import Explorateur from "@/pages/Explorateur";
import Cinema from "@/pages/Cinema";
import Mixeur from "@/pages/Mixeur";
import ChatGallica from "@/pages/ChatGallica";
import ImmersionTab from "@/components/immersion/ImmersionTab";
import Studio from "@/pages/Studio";


export default function Home() {
  const [activeTab, setActiveTab] = useState("immersion");
  const [carriedDoc, setCarriedDoc] = useState(null);

  function carryTo(target, doc) {
    setCarriedDoc({ ...doc, target });
    setActiveTab(target);
  }

  return (
    <div className="h-screen flex flex-col bg-[#0A0D12] text-white overflow-hidden">
      <TabBar active={activeTab} onChange={setActiveTab} />
      <div className="flex-1 p-4 min-h-0 overflow-auto">
        {activeTab === "explorateur" && <Explorateur />}
        {activeTab === "cinema" && <Cinema carriedDoc={carriedDoc} />}
        {activeTab === "mixeur" && <Mixeur />}
        {activeTab === "studio" && <Studio />}
        {activeTab === "immersion" && (
          <ImmersionTab
            onOpenMixer={() => setActiveTab("mixeur")}
            carriedDoc={carriedDoc}
          />
        )}
        {activeTab === "chat" && (
          <ChatGallica
            onCarryToCinema={(doc) => carryTo("cinema", doc)}
            onCarryToImmersion={(doc) => carryTo("immersion", doc)}
          />
        )}
      </div>
    </div>
  );
}