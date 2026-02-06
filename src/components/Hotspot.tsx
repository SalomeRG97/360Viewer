import React, { useRef, useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { latLonToXYZ, xyzToLatLon } from "../utils/geometry";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export type HotspotData = {
  id: string;
  lat: number;
  lon: number;
  content: string;
  type?: string;
};

type Props = {
  data: HotspotData;
  radius: number;
  onMove: (id: string, lat: number, lon: number) => void;
  sphereRef: React.RefObject<THREE.Mesh | null>;
  controlsRef: React.RefObject<any>;
};

const Hotspot: React.FC<Props> = ({ data, radius, onMove, controlsRef }) => {
  const { camera, gl, scene } = useThree();

  const dragging = useRef(false);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const [hover, setHover] = useState(false);

  const position = latLonToXYZ(data.lat, data.lon, radius);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!dragging.current) return;

      const rect = gl.domElement.getBoundingClientRect();

      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      const sphere = scene.children.find(
        (o) => o.type === "Mesh",
      ) as THREE.Mesh;
      if (!sphere) return;

      const hit = raycaster.current.intersectObject(sphere)[0];
      if (!hit) return;

      const { lat, lon } = xyzToLatLon(hit.point.x, hit.point.y, hit.point.z);

      onMove(data.id, lat, lon);
    };

    const handleUp = () => {
      if (!dragging.current) return;

      dragging.current = false;
      document.body.style.cursor = "default";

      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    };

    gl.domElement.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      gl.domElement.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [camera, gl, scene, onMove, data.id]);

  return (
    <group position={position}>
      {/* 🔥 ZONA GRANDE INVISIBLE (interacción) */}
      <mesh
        onPointerDown={(e) => {
          e.stopPropagation();
          dragging.current = true;

          if (controlsRef.current) {
            controlsRef.current.enabled = false;
          }

          document.body.style.cursor = "grabbing";
        }}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 🔹 PUNTO VISIBLE */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={hover ? "#00bcd4" : "white"} />
      </mesh>

      {hover && (
        <Html center>
          <div className="tooltip">Arrastrar</div>
        </Html>
      )}
    </group>
  );
};

export default React.memo(Hotspot);
