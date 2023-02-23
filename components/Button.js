import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

function Button({ insideSpheres, onClick }) {
  const [active, setActive] = useState(false);
  const length = insideSpheres.length;
  const positions = Array.from({ length: length }, (_, index) => [
    index * 0.5,
    0,
    0,
  ]);

  return (
    <>
      {positions.map((position, index) => (
        <Sphere
          key={index}
          id={insideSpheres[index]}
          position={position}
          onClick={onClick}
          active={active}
          setActive={setActive}
        />
      ))}
    </>
  );
}

function Sphere({ position, onClick, active, setActive, id }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false); // Ajout de l'état hovered
  useFrame((state, delta) => {
    if (mesh.current) {
      const scaleFactor = 1 + 0.1 * Math.sin(state.clock.elapsedTime * 2);
      mesh.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
  });

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
    //setActive(!active);
  };

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)} // Modification de l'état hovered
      onPointerOut={() => setHovered(false)} // Modification de l'état hovered
    >
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshStandardMaterial
        color={active ? "hotpink" : hovered ? "green" : "red"}
      />
    </mesh>
  );
}

export default Button;
