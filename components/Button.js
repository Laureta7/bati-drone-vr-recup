import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

function Button({ insideSpheres, currentSphere, onClick }) {
  const [active, setActive] = useState(false);
  const length = insideSpheres.length;
  const positions = Array.from({ length: length }, (_, index) => [
    index * 0.5,
    0,
    0,
  ]);

  const pos = [
    [0.0, 0.0, 0.0],
    [0.08614, 0.26667, 0.94743],
    [-0.61448, 0.2, 0.24595],
    [-0.2686, 0.13333, 0.17163],
    [0.13704, 0.13333, 0.29262],
    [0.13781, 0.1, 0.7164],
    [0.56752, 0.1, 0.44191],
    [0.30782, 0.1, -0.22172],
    [-0.16431, 0.1, -0.19082],
    [-0.08962, 0.06667, -0.41154],
    [-0.67447, 0.1, -0.44607],
  ];

  return (
    <>
      {pos.map((position, index) => {
        if (insideSpheres[index] !== currentSphere) {
          return (
            <Sphere
              key={index}
              id={insideSpheres[index]}
              position={position}
              onClick={onClick}
              active={active}
              setActive={setActive}
            />
          );
        } else {
          return null;
        }
      })}
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
      <sphereGeometry args={[0.015, 32, 16]} />
      <meshStandardMaterial
        color={active ? "hotpink" : hovered ? "green" : "red"}
      />
    </mesh>
  );
}

export default Button;
