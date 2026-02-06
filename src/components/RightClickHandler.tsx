import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  sphereRef: React.RefObject<THREE.Mesh | null>;
  onPick: (point: THREE.Vector3, x: number, y: number) => void;
};

const RightClickHandler: React.FC<Props> = ({ sphereRef, onPick }) => {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      if (!sphereRef.current) return;

      event.preventDefault();

      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(sphereRef.current);
      if (intersects.length > 0) {
        onPick(intersects[0].point, event.clientX, event.clientY);
      }
    };

    gl.domElement.addEventListener("contextmenu", handleContextMenu);
    return () => {
      gl.domElement.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [camera, gl, sphereRef, onPick]);

  return null;
};

export default RightClickHandler;
