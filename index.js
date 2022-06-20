const express = require("express");
const app = express();
const port = 5000;

const path = require("path");
const router = express.Router();

app.use(express.static("public"));

app.set("/js", express.static(__dirname + "public/js"));

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/ingredients.html"));
});

app.use("/", router);
app.listen(port, () => console.info(`App listening on port ${port}`));
