const bodyParser = require("body-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
// const DB = require(__dirname + "/routes/db.js");
port = 3010;
PRIKEY = "SHIVANG";

app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//     try {
//         //var token = jwt.sign({ reqby: "Nilay" }, PRIKEY);
//         var token = jwt.verify(req.headers.authkey, PRIKEY);
//     } catch (err) {
//         console.log(err);
//         res.status(401).send({ message: "Invalid Token" });
//         return;
//     }
//     console.log(token);
//     next();
// });

app.use("/user", require("./API/routes/userRoutes"));
app.use("/project", require("./API/routes/projectRoutes"));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
});
