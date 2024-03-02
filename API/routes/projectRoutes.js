/*
        This file contain the routes for the project-management
        /project/getProject     => Input: projectId                                      => Output: all the project detailes        => method: POST
        /project/createProject  => Input: Project-name,  project_level                   => Output: Project created successfully    => method: POST
                                          Project-defination, Project-description,       
                                          Project-creator, Project-creation-date, 
                                          no-of-student-required, no-of-student-joined, 
                                          student-required-by-department, hosted_by, 
                                          required_time,                    

*/

const bodyParser = require("body-parser");
const express = require("express");
const DB = require("../dbFunc/projectDB.js");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.post("/getProject", function (req, res) {
    projectData = req.body;
    try {
        if (projectData) {
            result = DB.getProject(projectData);
            if (result) {
                res.send(result);
            } else {
                res.status(400).send({ msg: "Project does not found" });
            }
        }
        res.status(400).send({ msg: "Please pass projectname" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.post("/createProject", async function (req, res) {
    projectData = req.body; // Project-name, Project-defination, Project-description, Project-creator, Project-creation-date, no-of-student-required, no-of-student-joined, student-required-by-department, hosted_by, required_time, project_level
    try {
        if (projectData) {
            // Verify that the host does not have any other project with same name
            result = await DB.validteProjectName(
                projectData.projectName,
                projectData.hostedBy
            ); //if result is true then project name is already taken by this host
            if (result) {
                res.status(400).send({
                    msg: "Project name is already taken by this host",
                });
            } else {
                if (await DB.createProject(projectData)) {
                    res.send({
                        msg: "Project created successfully",
                        project_id: projectData.projectID,
                    });
                } else {
                    res.status(400).send({
                        msg: "Project is not created due to some error. please try again.",
                    });
                }
            }
        }
        res.status(400).send({ msg: "Please pass projectname" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

module.exports = router;
