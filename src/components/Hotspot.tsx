import React, { useRef, useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { latLonToXYZ, xyzToLatLon } from "../utils/geometry";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import HotspotPopup, { type PopupData } from "./HotspotPopup";

export type HotspotData = {
  id: string;
  lat: number;
  lon: number;
  content: string;
  type?: string;
  active?: boolean;
  popup?: PopupData;
};

type Props = {
  data: HotspotData;
  radius: number;
  onMove: (id: string, lat: number, lon: number) => void;
  sphereRef: React.RefObject<THREE.Mesh | null>;
  controlsRef: React.RefObject<any>;
  onPopupChange: (open: boolean) => void;
};

const Hotspot: React.FC<Props> = ({
  data,
  radius,
  onMove,
  controlsRef,
  onPopupChange,
}) => {
  const { camera, gl, scene } = useThree();

  const dragging = useRef(false);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const [hover, setHover] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const type2Ref = useRef<THREE.Mesh>(null);

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

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !popupVisible;
    }
    onPopupChange(popupVisible);
  }, [popupVisible, controlsRef, onPopupChange]);

  useEffect(() => {
    if (data.type === "Tipo 2" && type2Ref.current) {
      const el = type2Ref.current.scale;
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(el, { x: 1.5, y: 1.5, z: 1.5, duration: 0.8 });

      // ✅ Función de limpieza para useEffect
      return () => {
        tl.kill();
      };
    }
  }, [data.type]);

  return (
    <group position={position}>
      {/* Zona de interacción */}
      <mesh
        onPointerDown={(e) => {
          e.stopPropagation();
          setPopupVisible(!popupVisible);
        }}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Tipo 1 */}
      {data.type === "Tipo 1" && (
        <>
          <Html center transform sprite distanceFactor={4}>
            <div
              style={{
                display: "inline-block",
                padding: "0.6em 0.7em",
                backgroundColor: "rgba(51, 51, 51, 0.9)",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.9rem",
                textAlign: "center",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
              onClick={() => setPopupVisible(true)}
            >
              {data.content}
            </div>
          </Html>

          {popupVisible && data.popup && (
            <HotspotPopup
              visible={popupVisible}
              onClose={() => setPopupVisible(false)}
              position={[0, 0.3, 0]}
              content={data.popup}
            />
          )}
        </>
      )}

      {/* Tipo 2 */}
      {data.type === "Tipo 2" && (
        <mesh ref={type2Ref}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={data.active ? "green" : "red"} />
          {popupVisible && data.popup && (
            <HotspotPopup
              visible={popupVisible}
              onClose={() => setPopupVisible(false)}
              position={[0, 0.3, 0]}
              content={data.popup}
            />
          )}
        </mesh>
      )}

      {/* Tipo 3 o default */}
      {data.type === "Tipo 3" && (
        <group>
          {/* Invisible clickable mesh */}
          <mesh
            position={[0, 0, 0]}
            onPointerDown={(e) => {
              e.stopPropagation();
              setPopupVisible(!popupVisible);
            }}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
          >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial transparent opacity={0} />
            {/* Icono HTML sobre el hotspot */}
            <Html center>
              <div
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setPopupVisible(!popupVisible);
                }}
                style={{
                  display: "inline-block",
                  cursor: "pointer",
                }}
              >
                <i
                  className="bi bi-geo-alt-fill"
                  style={{
                    fontSize: "1.5rem",
                    color: hover ? "#34b114" : "#97f0c4",
                  }}
                />
              </div>
            </Html>
          </mesh>

          {/* Popup */}
          {popupVisible && data.popup && (
            <HotspotPopup
              visible={popupVisible}
              onClose={() => setPopupVisible(false)}
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
