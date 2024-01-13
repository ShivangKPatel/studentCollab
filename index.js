const bodyParser = require('body-parser');
const express = require('express');
// const DB = require(__dirname + "/routes/db.js");
port = 3000;

app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', require("./API/routes/userRoutes"));
app.use('/project', require("./API/routes/projectRoutes"));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
})