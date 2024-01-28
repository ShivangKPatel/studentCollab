const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
// const DB = require(__dirname + "/routes/db.js");
port = 3010;

app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", require("./API/routes/userRoutes"));
app.use("/project", require("./API/routes/projectRoutes"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
