// src/utils/geometry.ts
import * as THREE from "three";

// lat/lon -> posición XYZ
export function latLonToXYZ(lat: number, lon: number, radius: number = 5) {
  const theta = THREE.MathUtils.degToRad(lon);
  const phi = THREE.MathUtils.degToRad(90 - lat);

  const x = -radius * Math.sin(phi) * Math.sin(theta); // X invertido por esfera invertida
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return [x, y, z] as [number, number, number];
}

// posición XYZ -> lat/lon
export function xyzToLatLon(x: number, y: number, z: number) {
  const radius = Math.sqrt(x * x + y * y + z * z);
  const lat = 90 - THREE.MathUtils.radToDeg(Math.acos(y / radius));
  const lon = THREE.MathUtils.radToDeg(Math.atan2(-x, z));
  return { lat, lon };
}
