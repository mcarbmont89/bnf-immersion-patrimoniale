import React, { useState } from "react";
import TabBar from "@/components/immersion/TabBar";
import Explorateur from "@/pages/Explorateur";
import Cinema from "@/pages/Cinema";
import Mixeur from "@/pages/Mixeur";
import ChatGallica from "@/pages/ChatGallica";
import ImmersionTab from "@/components/immersion/ImmersionTab";


export default function Home() {
  const [activeTab, setActiveTab] = useState("immersion");

  return (
    <div className="h-screen flex flex-col bg-[#0A0D12] text-white overflow-hidden">
      <TabBar active={activeTab} onChange={setActiveTab} />
      <div className="flex-1 p-4 min-h-0 overflow-auto">
        {activeTab === "explorateur" && <Explorateur />}
        {activeTab === "cinema" && <Cinema />}
        {activeTab === "mixeur" && <Mixeur />}
        {activeTab === "studio" && (
          <div className="h-full flex items-center justify-center text-[#9CA3AF]">
            Studio Spatialisation · contenu déjà présent dans le prompt initial.
          </div>
        )}
        {activeTab === "immersion" && (
          <ImmersionTab onOpenMixer={() => setActiveTab("mixeur")} />
        )}
        {activeTab === "chat" && <ChatGallica />}
      </div>
    </div>
  );
}