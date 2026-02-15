import React from "react";
import { Html } from "@react-three/drei";

export type PopupData = {
  type: string;
  src?: string; // para image o iframe
  text?: string; // para texto
};

type HotspotPopupProps = {
  visible: boolean;
  onClose: () => void;
  content: PopupData;
  position: [number, number, number];
};

const HotspotPopup: React.FC<HotspotPopupProps> = ({
  visible,
  onClose,
  content,
  position,
}) => {
  if (!visible) return null;

  return (
    <Html position={position} center>
      <div
        style={{
          position: "relative",
          background: "rgba(0,0,0,0.85)",
          borderRadius: "8px",
          color: "white",
          width: "400px",
          height: "250px",
          padding: "1em",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Botón cerrar usando Bootstrap Icon */}
        <i
          className="bi bi-x-circle"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontSize: "24px",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
          }
        ></i>

        {/* Contenido */}
        {(content.type as string) === "image" && content.src && (
          <img
            src={content.src}
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "4px" }}
          />
        )}
        {(content.type as string) === "iframe" && content.src && (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <iframe
              src={content.src}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "4px",
                pointerEvents: "auto",
                cursor: "grab",
              }}
              allowFullScreen
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            />
          </div>
        )}
        {(content.type as string) === "text" && content.text && (
          <p>{content.text}</p>
        )}
      </div>
    </Html>
  );
};

export default HotspotPopup;
