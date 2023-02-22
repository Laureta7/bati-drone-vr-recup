import React from "react";
import { Canvas } from "@react-three/fiber";

import SphereWithTexture from "./SphereWithTexture";
import CameraControls from "./CameraControls";
import Button from "./Button";
import img360 from "../Assets/Bernex/21-05-Image_360_EST.jpg";

function ThreeScene() {
  return (
    <div style={{ height: "100vh", width: "100vw", backgroundColor: "black" }}>
      <Canvas style={{ height: "100%", width: "100%" }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <CameraControls />
        <SphereWithTexture imgSrc={img360} position={[0, 0, 0]} />
        <Button label="Cliquez-moi" position={[1.5, 0.5, 0]} />
      </Canvas>
    </div>
  );
}

export default ThreeScene;
