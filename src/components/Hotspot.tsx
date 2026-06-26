import React, { useRef, useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { latLonToXYZ, xyzToLatLon } from "../utils/geometry";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import HotspotPopup, { type PopupData } from "./HotspotPopup";

export type HotspotData = {
  id: string;
  lat: number;
  lon: number;
  content: string;
  type?: string;
  active?: boolean;
  popup?: PopupData;
  icon?: string;
};

type Props = {
  data: HotspotData;
  radius: number;
  onMove: (id: string, lat: number, lon: number) => void;
  sphereRef: React.RefObject<THREE.Mesh | null>;
  controlsRef: React.RefObject<any>;
  onPopupChange: (open: boolean) => void;
  activePopupId: string | null;
  setActivePopupId: (id: string | null) => void;
};

const Hotspot: React.FC<Props> = ({
  data,
  radius,
  onMove,
  controlsRef,
  onPopupChange,
  activePopupId,
  setActivePopupId,
}) => {
  const { camera, gl, scene } = useThree();

  const dragging = useRef(false);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const [hover, setHover] = useState(false);
  const type2Ref = useRef<THREE.Mesh>(null);

  const position = latLonToXYZ(data.lat, data.lon, radius);
  const isOpen = activePopupId === data.id;

  /* --------- DRAG --------- */
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
      dragging.current = false;
      if (controlsRef.current) controlsRef.current.enabled = true;
    };

    gl.domElement.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      gl.domElement.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [camera, gl, scene, onMove, data.id]);

  /* --------- CONTROLES --------- */
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isOpen;
    }
    onPopupChange(isOpen);
  }, [isOpen, controlsRef, onPopupChange]);

  return (
    <group position={position}>
      {/* ---------- TIPO 1 ---------- */}
      {data.type === "Tipo 1" && (
        <>
          <Html center transform sprite distanceFactor={4}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActivePopupId(data.id);
              }}
              style={{
                padding: "0.6em 0.7em",
                background: "rgba(51,51,51,0.9)",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {data.content}
            </div>
          </Html>

          {isOpen && data.popup && (
            <HotspotPopup
              visible
              onClose={() => setActivePopupId(null)}
              position={[0, 0.3, 0]}
              content={data.popup}
            />
          )}
        </>
      )}

      {/* ---------- TIPO 2 ---------- */}
      {data.type === "Tipo 2" && (
        <group>
          <mesh ref={type2Ref}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={data.active ? "green" : "red"} />
          </mesh>

          <Html center transform distanceFactor={4}>
            <div
              onPointerDown={(e) => {
                e.stopPropagation();
                setActivePopupId(data.id);
              }}
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            />
          </Html>

          {isOpen && data.popup && (
            <HotspotPopup
              visible
              onClose={() => setActivePopupId(null)}
              position={[0, 0.3, 0]}
              content={data.popup}
            />
          )}
        </group>
      )}

      {/* ---------- TIPO 3 ---------- */}
      {data.type === "Tipo 3" && (
        <group>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          <Html center sprite transform distanceFactor={4}>
            <div
              onPointerDown={(e) => {
                e.stopPropagation();
                setActivePopupId(data.id);
              }}
              onPointerEnter={() => setHover(true)}
              onPointerLeave={() => setHover(false)}
              style={{
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              <i
                className={data.icon ?? "fa-solid fa-circle"}
                style={{
                  fontSize: "1.5rem",
                  color: hover ? "#34b114" : "#ffffff",
                  pointerEvents: "none",
                }}
              />
            </div>
          </Html>

          {isOpen && data.popup && (
            <HotspotPopup
              visible
              onClose={() => setActivePopupId(null)}
              position={[0, 0.3, 0]}
              content={data.popup}
            />
          )}
        </group>
      )}
    </group>
  );
};

export default React.memo(Hotspot);
