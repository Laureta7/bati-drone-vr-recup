import React, { useRef } from "react";
import * as THREE from "three";
import { TextureLoader, RepeatWrapping } from "three";

function SphereWithTexture(props) {
  const mesh = useRef();
  const { imgSrc } = props;

  // Chargement de la texture de l'image
  const texture = new TextureLoader().load(imgSrc);

  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.offset.x = 1;
  texture.repeat.x = -1;

  return (
    <mesh {...props} ref={mesh}>
      <sphereGeometry args={[1, 64, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default SphereWithTexture;
