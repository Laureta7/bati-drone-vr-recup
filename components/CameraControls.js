import React, { useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

extend({ OrbitControls });

const sphereRadius = 1;

function CameraControls({ lookAtPosition }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  camera.position.set(0, 0, 0);

  // const updateCameraDirection = () => {
  //   // Faire en sorte que la caméra regarde vers l'objet
  //   camera.lookUp();
  //   console.log("cam ", camera);
  // };
  // updateCameraDirection();
  useFrame(() => {
    camera.lookAt(lookAtPosition);
    controlsRef.current.update();
    const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    if (distance > sphereRadius) {
      camera.position.setLength(sphereRadius);
      controlsRef.current.update();
    }
  });

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={1.2}
      minDistance={0.1}
      maxDistance={10}
      maxPolarAngle={Math.PI / 2}
    />
  );
}

export default CameraControls;
