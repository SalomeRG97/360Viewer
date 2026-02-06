import React, { useRef, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

import Hotspots from "./Hotspots";
import HotspotMenu from "./HotspotMenu";
import RightClickHandler from "./RightClickHandler";

import { xyzToLatLon } from "../utils/geometry";
import type { HotspotData } from "./Hotspot";

const hotspotTypes = ["Tipo 1", "Tipo 2", "Tipo 3"];

const Visor360: React.FC = () => {
  const texture = useLoader(THREE.TextureLoader, "/scene.jpg");

  const sphereRef = useRef<THREE.Mesh>(null);
  const controlsRef = useRef<any>(null);

  const [hotspots, setHotspots] = useState<HotspotData[]>([]);
  const [menu, setMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    lat?: number;
    lon?: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleSelectType = (type: string) => {
    if (menu.lat === undefined || menu.lon === undefined) return;

    const newHotspot = {
      id: crypto.randomUUID(),
      lat: menu.lat,
      lon: menu.lon,
      type,
      content: type,
    };

    setHotspots((prev) => [...prev, newHotspot]);
    setMenu((m) => ({ ...m, visible: false }));
  };

  const updateHotspotPosition = (id: string, lat: number, lon: number) => {
    setHotspots((prev) =>
      prev.map((h) => (h.id === id ? { ...h, lat, lon } : h)),
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {menu.visible && (
        <HotspotMenu
          x={menu.x}
          y={menu.y}
          types={hotspotTypes}
          onSelect={handleSelectType}
        />
      )}

      <Canvas camera={{ position: [0, 0, 0.1] }}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={-0.4}
          enableDamping
          dampingFactor={0.1}
          ref={controlsRef}
        />
        <ambientLight intensity={1} />

        {/* Esfera 360 */}
        <Sphere ref={sphereRef} args={[5, 64, 64]} scale={[-1, 1, 1]}>
          <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </Sphere>

        {/* Click derecho */}
        <RightClickHandler
          sphereRef={sphereRef}
          onPick={(point, x, y) => {
            const { lat, lon } = xyzToLatLon(point.x, point.y, point.z);
            setMenu({
              visible: true,
              x,
              y,
              lat,
              lon,
            });
          }}
        />

        {/* Hotspots */}
        <Hotspots
          hotspots={hotspots}
          radius={5.01}
          onMove={updateHotspotPosition}
          sphereRef={sphereRef}
          controlsRef={controlsRef}
        />
      </Canvas>
    </div>
  );
};

export default Visor360;
