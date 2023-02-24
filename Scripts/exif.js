var ExifImage = require("node-exif").ExifImage;

try {
  new ExifImage(
    { image: "../Projects/Bernex/21-06-21-image360_EST.jpg" },
    function (error, exifData) {
      if (error) console.log("Error: " + error.message);
      else console.log(exifData); // Do something with your data!
    }
  );
} catch (error) {
  console.log("Error: " + error.message);
}
