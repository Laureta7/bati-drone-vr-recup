import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

function Button({ insideSpheres, currentSphere, pos, onClick }) {
  var working = true;
  // if (currentSphere)
  insideSpheres.forEach((element) => {
    //console.log(element);
  });
  //console.log("inside s", insideSpheres);
  const [active, setActive] = useState(false);
  const length = insideSpheres.length;
  const positions = Array.from({ length: length }, (_, index) => [
    index * 0.5,
    0,
    0,
  ]);
  if (!pos) {
    pos = positions;
  }

  return (
    <>
      {pos.map((position, index) => {
        // console.log(position, " current s", currentSphere);
        if (insideSpheres[index] !== currentSphere) {
          /*console.log(
            "inside button ",
            insideSpheres[index],
            " CS ",
            currentSphere
          );*/
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
  const calculateMousePosition = () => {};
  useEffect(() => {
    document.addEventListener("mousemove", getMousePosition);
  }, [hovered]);

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={handleClick}
      onPointerOver={() => {
        calculateMousePosition();
        setHovered(true);
        this.removeEventListener("pointerover", handlePointerOver);
      }} // Modification de l'état hovered
      onPointerOut={() => setHovered(false)} // Modification de l'état hovered
    >
      <sphereGeometry args={[0.015, 32, 16]} />
      <meshStandardMaterial
        color={active ? "hotpink" : hovered ? "green" : "red"}
      />
    </mesh>
  );
}
function getMousePosition(event) {
  const mousePos = [];
  const posX = event.clientX;
  const posY = event.clientY;
  mousePos.push(posX);
  mousePos.push(posY);
  console.log(`La position de la souris est (${posX}, ${posY})`);
}

export default Button;
