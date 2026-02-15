export type HotspotType = {
  id: string; // Identificador único del hotspot
  content: string; // Texto o contenido asociado
  type?: string; // Tipo opcional, por ejemplo "info", "link", etc.
  position: [number, number, number]; // Coordenadas XYZ en Three.js
};
