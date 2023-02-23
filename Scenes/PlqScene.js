import React, { useState, useEffect } from "react";
import { sortDatesDescending } from "../lib/functions";

import { Canvas } from "@react-three/fiber";
import MenuVisite from "../components/MenuVisite";
import SphereWithTexture from "../components/SphereWithTexture";
import CameraControls from "../components/CameraControls";
import Button from "../components/Button";

function PlqScene() {
  // initialisation des différents états
  const [projectData, setProjectData] = useState([null]);
  const [imgSrc, setImgSrc] = useState([
    "https://batilac-cloud-local.s3.eu-west-3.amazonaws.com/plq-le-roliet/S00-190223.jpg",
  ]);
  const [imgUrls, setImgUrls] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [currentSphere, setCurrentSphere] = useState("S01");
  const [insideSpheres, setInsideSpheres] = useState([]);
  const [items, setItems] = useState([]);

  // useEffect est utilisé ici pour charger les données à partir d'un fichier JSON
  useEffect(() => {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        setProjectData(data);
        const organizedData = {};

        // les données sont organisées en fonction de leur date
        data.forEach((obj) => {
          const { date, sphere, imgUrl } = obj;
          if (organizedData[date]) {
            organizedData[date].push({ sphere, imgUrl });
          } else {
            organizedData[date] = [{ sphere, imgUrl }];
          }
        });

        // les dates sont triées dans l'ordre décroissant
        var organizedDates = Object.keys(organizedData);
        organizedDates = sortDatesDescending(organizedDates);

        // les dates triées sont ensuite stockées dans l'état items
        setItems(organizedDates);
        //Mettre à jour la date la plus récente [date]
        setCurrentDate(organizedDates[0]);
      })
      .catch((error) => console.log(error));
  }, []);

  // les fonctions suivantes sont appelées lorsqu'un bouton est cliqué
  const changeSphereTexture = (id) => {
    console.log("inside spheres : ", insideSpheres);

    console.log("MEsg id ", id);
  };

  //Excécuter quand currentDate change
  //Mais à jour l'array des images utilisé pour cette nouvelle date
  useEffect(() => {
    const urlsToAdd = [];
    if (projectData) {
      projectData.forEach((obj) => {
        if (obj) {
          const { date, sphere, imgUrl } = obj;
          if (date === currentDate) {
            urlsToAdd.push([sphere, imgUrl]);
          }
        }
      });
      setImgUrls(urlsToAdd);
    }
  }, [currentDate]);
  //Changement imgSrc apres cangemen setImgUrl
  useEffect(() => {
    const spheresToAdd = [];
    imgUrls.forEach((obj) => {
      const [sphere, imgUrl] = obj;
      spheresToAdd.push(sphere);

      if (sphere === currentSphere) {
        console.log("Sphere ", sphere, " url ", imgUrl);
        setImgSrc(imgUrl);
      }
    });
    setInsideSpheres(spheresToAdd);
  }, [imgUrls]);

  const changeImgSrc = (date) => {
    setCurrentDate(date);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <MenuVisite items={items} onDateSelect={changeImgSrc} />

      <div style={{ flex: "1", overflow: "hidden" }}>
        <Canvas style={{ height: "100%", width: "100%" }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <CameraControls />
          <SphereWithTexture imgSrc={imgSrc} position={[0, 0, 0]} />
          <Button
            insideSpheres={insideSpheres}
            label="Cliquez-moi"
            position={[1.5, 0, 0]}
            onClick={changeSphereTexture}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default PlqScene;
