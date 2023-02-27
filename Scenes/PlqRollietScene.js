import React, { useState, useEffect } from "react";
import { sortDatesDescending, sortObject } from "../lib/functions";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import MenuVisite from "../components/MenuVisite";
import SphereWithTexture from "../components/SphereWithTexture";
import CameraControls from "../components/CameraControls";
import Button from "../components/Button";

function PlqScene() {
  // initialisation des différents états
  const [projectData, setProjectData] = useState([null]);
  const [imgSrc, setImgSrc] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [currentSphere, setCurrentSphere] = useState("S00");
  const [insideSpheres, setInsideSpheres] = useState([]);
  const [items, setItems] = useState([]);
  const [usedPositions, setUsedPositions] = useState([]);
  const [datas, setDatas] = useState({});

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
  // useEffect est utilisé ici pour charger les données à partir d'un fichier JSON
  useEffect(() => {
    fetch("ROL.json")
      .then((response) => response.json())
      .then((data) => {
        const organizedData = {};
        // les données sont organisées en fonction de leur date

        data.forEach((obj) => {
          const { date, sphere, imgUrl, positionId } = obj;
          // console.log("date ", date, "sphere ", sphere, "img ", imgUrl);
          if (organizedData[date]) {
            organizedData[date].push({ sphere, imgUrl, positionId });
            // console.log("OUI ", organizedData[date]);
          } else {
            organizedData[date] = [{ sphere, imgUrl, positionId }];
            // console.log("Non ", organizedData[date]);
          }
        });
        const sortedDatas = sortObject(organizedData);
        setDatas(sortedDatas);

        // console.log(sortedDatas);
        //Set la current date à la date la plus récente
        const date = Object.keys(sortedDatas)[0];
        setCurrentDate(date);

        const sphere = sortedDatas[date][0].sphere;
        setCurrentSphere(sphere);

        setItems(Object.keys(sortedDatas));
        const memPos = [];

        sortedDatas[date].forEach((obj) => {
          const { positionId } = obj;
          memPos.push(pos[positionId]);
        });
        setUsedPositions(memPos);
      })
      .catch((error) => console.log(error));
  }, []);

  // les fonctions suivantes sont appelées lorsqu'un bouton est cliqué
  const changeSphereTexture = (id) => {
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
    console.log(
      "new sphere ",
      currentSphere,
      " newURL ",
      imgSrc,
      "usedPos ",
      usedPositions
    );
  }, [imgSrc]);

  //TRIGGER APRES CHANGEMENT IMGSURL
  useEffect(() => {
    const spheresToAdd = [];

    if (datas[currentDate]) {
      datas[currentDate].forEach((obj) => {
        if (obj) {
          const { sphere, imgUrl } = obj;
          spheresToAdd.push(sphere);
          // console.log("Spheres to add ", sphere);
          if (sphere === currentSphere) {
            setImgSrc(imgUrl);
          }
        }
      });
      setInsideSpheres(spheresToAdd);
    }
  }, [imgUrls]);

  const changeImgSrc = (date) => {
    //console.log("New date ", date);
    const keepPos = [];
    datas[date].forEach((obj) => {
      if (obj) {
        const { positionId } = obj;
        keepPos.push(pos[positionId]);
      }
    });
    //console.log("New Position  ", keepPos);

    //update currentdate + usedPositions

    setCurrentDate(date);
    setUsedPositions(keepPos);
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
            pos={usedPositions}
            onClick={changeSphereTexture}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default PlqScene;
