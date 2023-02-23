import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

function Button({ insideSpheres, position, onClick }) {
  const mesh = useRef();
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (mesh.current) {
      const scaleFactor = 1 + 0.1 * Math.sin(state.clock.elapsedTime * 2);
      mesh.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
  });

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setActive(!active);
  };

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
    >
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshStandardMaterial color={active ? "hotpink" : "red"} />
    </mesh>
  );
}

export default Button;
