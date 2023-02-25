const AWS = require("aws-sdk");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const fs = require("fs");
const exifr = require("exifr");

let projectsViewPoints = {
  bernex: [
    { lat: 46.180517, long: 6.079487 },
    { lat: 46.18055, long: 6.0807 },
  ],
  lerolliet: [
    { lat: 46.180517, long: 6.079487 },
    { lat: 46.18055, long: 6.0807 },
  ],
};

let project = "plq-le-roliet";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const params = {
  Bucket: "batilac-cloud-local",
  Prefix: `${project}/`,
};
var bucketregion = "";
s3.getBucketLocation({ Bucket: "batilac-cloud-local" }, (err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
    bucketregion = data.LocationConstraint;
  }
});

s3.listObjects(params, (err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
    const contents = data.Contents;
    const result = [];
    const splittedUrl = [];

    contents.forEach((content) => {
      const key = content.Key;
      if (key.endsWith(".jpg")) {
        // const splittedKey = key.split("/");
        // const filename = splittedKey[1];
        // const sphere = filename.split("-")[0];
        // const date = filename.split("-")[1].slice(0, -4);
        // const formattedDate = date.replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
        const imgUrl = `https://${params.Bucket}.s3.${bucketregion}.amazonaws.com/${key}`;

        result.push(imgUrl);
      }
    });
    //console.log(result);
    exifrFunction(result);

    // getImagesJson(result);
  }
});

async function exifrFunction(files) {
  const images = [];
  var i = 0;
  for (const file of files) {
    try {
      const exifData = await exifr.parse(file);
      const splittedUrl = file.split("/");
      const filename = splittedUrl[splittedUrl.length - 1];
      const splittedKey = filename.split("-");
      const date = splittedKey[0]
        .concat("-" + splittedKey[1])
        .concat("-" + splittedKey[2]);

      const image = {
        project: project,
        imgUrl: file,
        date: date,
        filename: filename,
        GPSLatitude: exifData.latitude,
        GPSLongitude: exifData.longitude,
      };

      images.push(image);

      i++;
    } catch (error) {
      console.log("Error: " + error.message);
      console.log("Cette url a un problème : ", files[i]);
    }
  }

  // console.log("images", images, +" ", images.length);

  sortImages(images);

  //   const json = JSON.stringify(images, null, 2);
  //   fs.writeFileSync("./images.json", json, "utf8");
}

function sortImages(images) {
  const finalImages = [];
  //console.log(viewPoints[0].lat);
  // console.log(images);
  var j, dmin, dmax, jmin;
  let viewPoints = projectsViewPoints[project];
  images.forEach((image) => {
    j = 0;
    jmin = 0;
    dmin = 1000;
    dmax = 0;

    const lat = image.GPSLatitude;
    const long = image.GPSLongitude;

    viewPoints.forEach((points) => {
      const d = calculateDistance(lat, long, points.lat, points.long);

      if (d < dmin) {
        dmin = d;
        jmin = j;
      }
      if (d > dmax) {
        dmax = d;
      }

      j++;
      /**
       * TEST DISTANCE CALCUL
       */
      //   if (j === 2) {
      //     console.log("plus proche de ", jmin, " ", dmin, " dmax ", dmax);
      //     if (jmin === 0) {
      //       console.log(image.filename + " EST");
      //     } else {
      //       console.log(image.filename + " WEST");
      //     }
      //   }
    });
    //JMIN desgin le point de vue le plus proche de l'image
    const newImage = createNewImage(image, jmin);
    finalImages.push(newImage);
  });
  //   const json = JSON.stringify(finalImages, null, 2);
  //   fs.writeFileSync("../public/images.json", json, "utf8");
  //console.log(finalImages);
  createJson(finalImages);
}
function createNewImage(image, jmin) {
  jmin += 1;
  var sphere = "S0";
  if (jmin > 10) {
    sphere = "S";
  }
  sphere = sphere.concat(jmin.toString());
  Object.assign(image, { sphere: sphere });

  //console.log(image);
  return image;
}
function calculateDistance(latA, longA, latB, longB) {
  var sinPhiA, sinPhiB, cosPhiA, cosPhiB, cosDeltaLong;
  sinPhiA = Math.sin((2 * Math.PI * latA) / 360);
  sinPhiB = Math.sin((2 * Math.PI * latB) / 360);
  cosPhiA = Math.cos((2 * Math.PI * latA) / 360);
  cosPhiB = Math.cos((2 * Math.PI * latB) / 360);

  cosDeltaLong = Math.cos((2 * Math.PI * (longB - longA)) / 360);
  const d =
    Math.acos(sinPhiA * sinPhiB + cosPhiA * cosPhiB * cosDeltaLong) * 6393893;

  console.log(d);
  return d;
}
function transformeCoordinates(coordinates) {
  return (res = coordinates[0] + coordinates[1] / 60 + coordinates[2] / 3600);
}

function createJson(datas) {
  try {
    const json = JSON.stringify(datas, null, 2);
    fs.writeFileSync(`../public/${project}.json`, json, "utf8");
  } catch (error) {
    console.log("Il y a eu une erreur dans l'écriture du fichier Json ", error);
  }
}
