const AWS = require("aws-sdk");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const fs = require("fs");
const { get } = require("http");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const params = {
  Bucket: "batilac-cloud-local",
  Prefix: "bernex/",
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

    getImagesJson(result);
  }
});

async function getImagesJson(urls) {
  fetch("http://localhost:3000/images.json")
    .then((response) => response.json())
    .then((datas) => {
      datas.forEach((data, index) => {
        urls.forEach((url) => {
          const splittedUrl = url.split("/");
          const filename = splittedUrl[4];
          const project = splittedUrl[3];
          if (filename === data.filename) {
            Object.assign(data, { imgUrl: url });
            Object.assign(data, { project: project });
          }
        });
      });
      console.log(datas);
      const jsonData = JSON.stringify(datas, null, 2);
      fs.writeFile("../public/bernex.json", jsonData, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Data saved to bernex.json");
        }
      });
    });
}
