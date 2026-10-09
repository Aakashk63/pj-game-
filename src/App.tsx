import React, { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { getLevelConfig } from './levels/levelRegistry';
import { LevelSelectMap } from './ui/LevelSelectMap';
import { BeatRunner } from './engine/BeatRunner';
import { SettingsModal } from './ui/SettingsModal';
import { AssetGallery } from './components/AssetGallery';

export const App: React.FC = () => {
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const startLevel = useGameStore((state) => state.startLevel);
  const [showSettings, setShowSettings] = useState(false);
  // Default to true as requested: "Show me the gallery first."
  const [showGallery, setShowGallery] = useState(true);

  // If the user wants to view the gallery or selects the Blueprint level
  if (showGallery || currentLevelId === 'level_req_blueprint') {
    return (
      <AssetGallery
        onBackToMap={() => {
          setShowGallery(false);
          useGameStore.getState().exitToMap();
        }}
      />
    );
  }

  // If no level is selected, render the campus progression roadmap
  if (!currentLevelId) {
    return (
      <>
        <LevelSelectMap
          onSelectLevel={(lvlId) => {
            if (lvlId === 'level_req_blueprint') {
              setShowGallery(true);
            } else {
              startLevel(lvlId);
            }
          }}
          onOpenSettings={() => setShowSettings(true)}
          onOpenGallery={() => setShowGallery(true)}
        />
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </>
    );
  }

  // Active level storyboard execution
  const activeConfig = getLevelConfig(currentLevelId);

  if (!activeConfig) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
        <h2 className="text-xl font-bold">Level Not Found</h2>
        <button
          onClick={() => useGameStore.getState().exitToMap()}
          className="px-4 py-2 bg-sky-500 rounded-lg text-slate-950 font-bold"
        >
          Return to Map
        </button>
      </div>
    );
  }

  return (
    <>
      <BeatRunner config={activeConfig} />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default App;
