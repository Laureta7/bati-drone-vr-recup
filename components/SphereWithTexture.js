import React, { useRef } from "react";
import * as THREE from "three";
import { TextureLoader, RepeatWrapping } from "three";

function SphereWithTexture(props) {
  const mesh = useRef();
  const { imgSrc } = props;

  // Chargement de la texture de l'image
  const texture = new THREE.TextureLoader().load(imgSrc);
  console.log("texture ", texture);
  // Chargement de la texture de l'image passée en props
  // const texture = useLoader(TextureLoader, imgSrc, (texture) => {
  //   texture.minFilter = THREE.LinearMipmapLinearFilter;
  // });
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
