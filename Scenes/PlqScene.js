import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import MenuVisite from "../components/MenuVisite";
import SphereWithTexture from "../components/SphereWithTexture";
import CameraControls from "../components/CameraControls";
import Button from "../components/Button";

// Créer une instance AWS S3

function PlqScene() {
  const [projectData, setProjectData] = useState([null]);
  const [imgSrc, setImgSrc] = useState(
    "https://batilac-cloud-local.s3.eu-west-3.amazonaws.com/plq-le-roliet/S00-190223.jpg"
  );
  const [date, setDate] = useState("19-02-23");
  const [items, setItems] = useState([]);
  const it = ["el1", "el2"];

  // useEffect(() => {
  //   fetch("data.json")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setProjectData(data);
  //       console.log(data);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);
  const handleDateSelect = (date) => {
    // Recherchez les objets du projet PLQ à la date sélectionnée
    console.log("project " + projectData);

    if (projectData.length > 0) {
      const objects = projectData.filter(
        (object) => object.date === date && object.project === "PLQ"
      );

      console.log(objects);
    } else {
      console.log("Les données du projet ne sont pas encore disponibles");
    }
  };
  const handleButtonClick = () => {
    if (
      imgSrc ===
      "https://batilac-cloud-local.s3.eu-west-3.amazonaws.com/plq-le-roliet/190223-est.jpg"
    ) {
      setImgSrc(
        "https://batilac-cloud-local.s3.eu-west-3.amazonaws.com/plq-le-roliet/190223-west.jpg"
      );
    } else {
      setImgSrc(
        "https://batilac-cloud-local.s3.eu-west-3.amazonaws.com/plq-le-roliet/190223-est.jpg"
      );
    }
  };
  const handleMenuButton = (date) => {
    // Recherchez les objets du projet PLQ à la date sélectionnée
    console.log("project " + projectData);
    const objects = projectData.filter(
      (object) => object.date === date && object.projet === "PLQ"
    );

    // Stockez les objets dans une variable pour les utiliser dans votre application
  };
  // const items = data.plq.map((plq) => plq.date);
  // useEffect(() => {
  //   console.log("data " + projectData[0].date);
  // }, [projectData]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <MenuVisite items={it} onDateSelect={handleMenuButton} />

      <div style={{ flex: "1", overflow: "hidden" }}>
        <Canvas style={{ height: "100%", width: "100%" }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <CameraControls />
          <SphereWithTexture imgSrc={imgSrc} position={[0, 0, 0]} />
          <Button
            label="Cliquez-moi"
            position={[1.5, 0, 0]}
            onClick={handleButtonClick}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default PlqScene;
