// src/components/Hotspots.tsx
import React, { useState } from "react";
import Hotspot, { type HotspotData } from "./Hotspot";
import * as THREE from "three";

type HotspotsProps = {
  hotspots: HotspotData[];
  radius: number;
  onMove: (id: string, lat: number, lon: number) => void;
  sphereRef: React.RefObject<THREE.Mesh | null>;
  controlsRef: React.RefObject<any>;
  onPopupChange: (open: boolean) => void;
};

const Hotspots: React.FC<HotspotsProps> = ({
  hotspots,
  radius,
  onMove,
  sphereRef,
  controlsRef,
  onPopupChange,
}) => {
  const [activePopupId, setActivePopupId] = useState<string | null>(null);

  return (
    <>
      {hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          data={hotspot}
          radius={radius}
          onMove={onMove}
          sphereRef={sphereRef}
          controlsRef={controlsRef}
          onPopupChange={onPopupChange}
          activePopupId={activePopupId}
          setActivePopupId={setActivePopupId}
        />
      ))}
    </>
  );
};

export default React.memo(Hotspots);
