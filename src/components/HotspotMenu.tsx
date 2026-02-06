import React from "react";

type HotspotMenuProps = {
  x: number;
  y: number;
  types: string[];
  onSelect: (type: string) => void;
};

const HotspotMenu: React.FC<HotspotMenuProps> = ({ x, y, types, onSelect }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        background: "black",
        border: "1px solid gray",
        borderRadius: "4px",
        padding: "4px",
        zIndex: 1000,
      }}
    >
      {types.map((t) => (
        <div
          key={t}
          style={{ padding: "2px 8px", cursor: "pointer" }}
          onClick={() => onSelect(t)}
        >
          {t}
        </div>
      ))}
    </div>
  );
};

export default HotspotMenu;
