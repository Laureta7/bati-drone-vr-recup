const AWS = require("aws-sdk");
require("dotenv").config();
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const params = {
  Bucket: "batilac-cloud-local",
  Prefix: "plq-le-roliet/",
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
    console.log(contents);
    const result = [];

    contents.forEach((content) => {
      const key = content.Key;
      if (key.endsWith(".jpg")) {
        const splittedKey = key.split("/");
        const filename = splittedKey[1];
        const sphere = filename.split("-")[0];
        const date = filename.split("-")[1].slice(0, -4);
        const formattedDate = date.replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
        const imgUrl = `https://${params.Bucket}.s3.${bucketregion}.amazonaws.com/${key}`;

        const obj = { key, date: formattedDate, sphere, imgUrl };
        result.push(obj);
      }
    });

    const jsonData = JSON.stringify(result, null, 2);
    fs.writeFile("../public/data.json", jsonData, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Data saved to data.json");
      }
    });
  }
});
