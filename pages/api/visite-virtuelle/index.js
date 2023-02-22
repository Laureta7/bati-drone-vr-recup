import fs from "fs";

export default (req, res) => {
  const data = fs.readFileSync("data.json", "utf-8");
  const jsonData = JSON.parse(data);
  res.status(200).json(jsonData);
};
