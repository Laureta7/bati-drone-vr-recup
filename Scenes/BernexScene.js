import React, { useState, useEffect } from "react";
import { sortObject } from "../lib/functions";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import MenuVisite from "../components/MenuVisite";
import SphereWithTexture from "../components/SphereWithTexture";
import CameraControls from "../components/CameraControls";
import Button from "../components/Button";

function BernexScene() {
  // initialisation des différents états
  const [imgSrc, setImgSrc] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [currentSphere, setCurrentSphere] = useState();
  const [insideSpheres, setInsideSpheres] = useState([]);
  const [items, setItems] = useState([]);
  const [datas, setDatas] = useState({});

  const pos = [
    [-0.43, 0.22, 0.26],
    [0.5, 0.22, 0.19],
  ];

  // useEffect est utilisé ici pour charger les données à partir d'un fichier JSON
  useEffect(() => {
    fetch("bernex.json")
      .then((response) => response.json())
      .then((data) => {
        const organizedData = {};
        //console.log(data);
        // les données sont organisées en fonction de leur date

        data.forEach((obj) => {
          const { date, sphere, imgUrl } = obj;
          // console.log("date ", date, "sphere ", sphere, "img ", imgUrl);
          if (organizedData[date]) {
            organizedData[date].push({ sphere, imgUrl });
            // console.log("OUI ", organizedData[date]);
          } else {
            organizedData[date] = [{ sphere, imgUrl }];
            // console.log("Non ", organizedData[date]);
          }
        });
        const sortedDatas = sortObject(organizedData);
        setDatas(sortedDatas);

        const date = Object.keys(sortedDatas)[0];
        setCurrentDate(date);
        const sphere = sortedDatas[date][0].sphere;
        setCurrentSphere(sphere);
        // console.log("CURRENT DAT ", Object.keys(sortedDatas)[0]);
        setItems(Object.keys(sortedDatas));
      })
      .catch((error) => console.log(error));
  }, []);

  // les fonctions suivantes sont appelées lorsqu'un bouton est cliqué
  const changeSphereTexture = (id) => {
    console.log("Sphere id ", id);
    setCurrentSphere(id);
  };

  useEffect(() => {
    if (datas[currentDate]) {
      datas[currentDate].forEach((obj) => {
        if (obj) {
          const { sphere, imgUrl } = obj;
          if (sphere === currentSphere) {
            setImgSrc(imgUrl);
          }
        }
      });
    }
  }, [currentSphere]);

  useEffect(() => {
    const urlsToAdd = [];
    if (datas[currentDate]) {
      datas[currentDate].forEach((obj) => {
        if (obj) {
          const { imgUrl } = obj;
          urlsToAdd.push(imgUrl);
        }
      });
      setImgUrls(urlsToAdd);
    }
  }, [currentDate]);
  useEffect(() => {
    console.log("new sphere ", currentSphere, " newURL ", imgSrc);
  }, [imgSrc]);

  //Excécuter quand currentDate change
  //Mais à jour l'array des images utilisé pour cette nouvelle date

  //Changement imgSrc apres cangemen setImgUrl
  useEffect(() => {
    const spheresToAdd = [];

    if (datas[currentDate]) {
      datas[currentDate].forEach((obj) => {
        if (obj) {
          const { sphere, imgUrl } = obj;
          spheresToAdd.push(sphere);
          if (sphere === currentSphere) {
            setImgSrc(imgUrl);
          }
        }
      });
      setInsideSpheres(spheresToAdd);
    }
  }, [imgUrls]);

  const changeImgSrc = (date) => {
    setCurrentDate(date);
  };

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      <MenuVisite items={items} onDateSelect={changeImgSrc} />

      <div style={{ flex: "1", overflow: "hidden" }}>
        <Canvas style={{ height: "100%", width: "100%" }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <CameraControls lookAtPosition={{ x: 1, y: 0.5, z: 0 }} />

          <SphereWithTexture imgSrc={imgSrc} position={[0, 0, 0]} />
          <Button
            insideSpheres={insideSpheres}
            currentSphere={currentSphere}
            pos={pos}
            position={[1.5, 0, 0]}
            onClick={changeSphereTexture}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default BernexScene;
