const bodyParser = require('body-parser');
const express = require('express');
const DB = require("../dbFunc/db.js");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/getProject', async function(req, res) {
    projectData = req.body;
    if (projectData) {
        result = await DB.getProject(projectData);
        if (result) {
            res.send(result)
        } else {
            res.send({ msg: "Project not found" })
        }
    }
    res.send({ msg: "Please pass projectname" })
});

module.exports = router