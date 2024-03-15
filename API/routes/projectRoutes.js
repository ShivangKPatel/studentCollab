/*
        This file contain the routes for the project-management
        /project/getProject     => Input: projectId                                      => Output: all the project detailes        => method: POST
        /project/createProject  => Input: Project-name,  project_level                   => Output: Project created successfully    => method: POST
                                          Project-defination, Project-description,       
                                          Project-creator, Project-creation-date, 
                                          no-of-student-required, no-of-student-joined, 
                                          student-required-by-department, hosted_by, 
                                          required_time,     
        /project/getAllProject  => Input: None                                           => Output: all the project detailes        => method: GET  
        /project/updateProject  => Input: projectId, Project-name,  project_level        => Output: Project updated successfully    => method: POST
                                            Project-defination, Project-description,
                                            no-of-student-required, no-of-student-joined,
                                            student-required-by-department, required_time,
*/

const bodyParser = require("body-parser");
const express = require("express");
const DB = require("../dbFunc/projectDB.js");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.post("/getProject", async function (req, res) {
    projectData = req.body;
    try {
        if (projectData) {
            result = await DB.getProject(projectData.projectId);
            if (result) {
                res.send(result);
            } else {
                res.status(400).send({ msg: "Project does not found" });
            }
        }
        else{
            res.status(400).send({ msg: "Please pass projectId" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.post("/createProject", async function (req, res) {
    projectData = req.body; // projectName, projectDefination, projectDescription, noOfStudentRequired, reqDep, hostedBy, projectLevel, timeToComp
    try {
        if (projectData) {
            // Verify that the host does not have any other project with same name
            result = await DB.validteProjectName(
                projectData.projectName,
                projectData.hostedBy
            ); //if result is true then project name is already taken by this host
            if (result) {
                return res.status(400).send({
                    msg: "Project name is already taken by this host",
                });
            } else {
                result = await DB.createProject(projectData)
                if(result) {
                    res.send({
                        msg: "Project created successfully",
                        projectId: result.project_id,
                    });
                } else {
                    res.status(400).send({
                        msg: "Project is not created due to some error. please try again.",
                    });
                }
            }
        }
        else{
            return res.status(400).send({ msg: "Please pass projectname" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.get("/getAllProject", async function(req, res){
    try{
        result = await DB.getAllProject();
        if(result){
            return res.send({
                projects: result
            })
        }
        else{
            return res.send({
                msg: "No project found"
            })
        }
    }catch(err){
        return res.status(500).send({msg: "Internal Server Error"});
    }
})

module.exports = router;
