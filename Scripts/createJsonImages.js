const fs = require("fs");
const path = require("path");
var ExifImage = require("node-exif").ExifImage;
const directoryPath = "../Projects/Bernex";
let images = [];

let oldviewPoints = [
  { lat: 46.18070930555555, long: 6.080723694444444 },
  { lat: 46.18083738888889, long: 6.080844055555556 },
];
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
let viewPoints = [
  { lat: 46.180517, long: 6.079487 },
  { lat: 46.18055, long: 6.0807 },
];
var specImg = [];
var i = 0;

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    console.log("Error getting directory information.");
  } else {
    files.forEach(function (file) {
      if (path.extname(file).toLowerCase() === ".jpg") {
        const imagePath = path.join(directoryPath, file);

        try {
          i++;

          new ExifImage({ image: imagePath }, function (error, exifData) {
            if (error) {
              console.log("Error: " + error.message);
            } else {
              const splittedKey = file.split("-");
              const date = splittedKey[0]
                .concat("-" + splittedKey[1])
                .concat("-" + splittedKey[2]);

              const image = {
                filename: file,
                date: date,
                GPSLatitude: exifData.gps.GPSLatitude,
                GPSLongitude: exifData.gps.GPSLongitude,
              };

              // console.log("img", image);
              images.push(image);
              //console.log(images);

              if (images.length === files.length) {
                sortImages();

                //   const json = JSON.stringify(images, null, 2);
                //   fs.writeFileSync("./images.json", json, "utf8");
              }
            }
          });
        } catch (error) {
          console.log("Error: " + error.message);
        }
      }
    });
  }
});

function sortImages() {
  const finalImages = [];
  //console.log(viewPoints[0].lat);
  var j, dmin, dmax, jmin;
  images.forEach((image) => {
    j = 0;
    jmin = 0;
    dmin = 1000;
    dmax = 0;

    const lat = transformeCoordinates(image.GPSLatitude);
    const long = transformeCoordinates(image.GPSLongitude);
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

      if (j === 2) {
        console.log("plus proche de ", jmin, " ", dmin, " dmax ", dmax);
        if (jmin === 0) {
          console.log(image.filename + " EST");
        } else {
          console.log(image.filename + " WEST");
        }
      }
    });
    //JMIN desgin le point de vue le plus proche de l'image
    const newImage = createNewImage(image, jmin);
    finalImages.push(image);
  });
  const json = JSON.stringify(finalImages, null, 2);
  fs.writeFileSync("../public/images.json", json, "utf8");
}
function createNewImage(image, jmin) {
  jmin += 1;
  var sphere = "S0";
  if (jmin > 10) {
    sphere = "S";
  }
  sphere = sphere.concat(jmin.toString());
  Object.assign(image, { sphere: sphere });

  console.log(image);
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

  //console.log(d);
  return d;
}
function transformeCoordinates(coordinates) {
  return (res = coordinates[0] + coordinates[1] / 60 + coordinates[2] / 3600);
}
