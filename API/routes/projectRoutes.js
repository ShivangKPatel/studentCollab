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
        /project/sendRequest    => Input: projectId, studentId                           => Output: Request sent successfully        => method: POST
        /project/getProjectRequest/:projectId => Input: projectId                        => Output: all the request for the project  => method: GET
        /project/acceptRequest  => Input: projectId, studentId                           => Output: Request accepted successfully    => method: POST
        /project/rejectRequest  => Input: projectId, studentId                           => Output: Request rejected successfully    => method: POST
        /project/requestStatusOfSpecProject/:projectId/:studentId => Input: projectId, studentId => Output: Request status of the project => method: GET
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
                res.send({msg: "Project found", project: result});
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

router.get("/getProject", async function (req, res) {
    projectData = req.query.projectId;
    console.log(projectData)
    try {
        if (projectData) {
            result = await DB.getProject(projectData);
            console.log(result)
            if (result) {
                res.send({msg: "Project found", project: result});
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
    console.log(projectData)
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
                        msg: "Project successfully hosted",
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
    console.log("Ok")
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

router.post("/updateProject", async function (req, res) {
    projectData = req.body; // projectId, projectName, projectDefination, projectDescription, noOfStudentRequired, reqDep, projectLevel, timeToComp
    try {
        if (projectData) {
            result = await DB.updateProject(projectData);
            if (result) {
                res.send({ msg: "Project updated successfully" });
            } else {
                res.status(400).send({ msg: "Project is not updated due to some error. please try again." });
            }
        }
        else{
            return res.status(400).send({ msg: "Please pass projectId" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.post("/sendRequest", async function (req, res) {
    requestData = req.body; // projectId, studentId
    console.log(requestData.projectId);
    try {
        if (requestData) {
            result = await DB.sendRequest(requestData.projectId, requestData.studentId);
            if (result) {
                res.send({ msg: "Request sent successfully" });
            } else {
                res.status(400).send({ msg: "Request is not sent due to some error. please try again." });
            }
        }
        else{
            return res.status(400).send({ msg: "Please pass projectId and studentId" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.get("/getProjectRequest/:projectId", async function (req, res) {
    requestData = req.params; // projectId
    try {
        if (requestData) {
            result = await DB.getProjectRequest(requestData.projectId);
            if (result) {
                res.send(result);
            } else {
                res.status(400).send({ msg: "No request found" });
            }
        }
        else{
            return res.status(400).send({ msg: "Please pass projectId" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.post("/acceptRequest", async function (req, res) {
    requestData = req.body; // projectId, studentId
    try {
        if (requestData) {
            result = await DB.acceptRequest(requestData.projectId, requestData.studentId);
            if (result) {
                res.send({ msg: "Request accepted successfully" });
            } else {
                res.status(400).send({ msg: "Request is not accepted due to some error. please try again." });
            }
        }
        else{
            return res.status(400).send({ msg: "Please pass projectId and studentId" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.post("/rejectRequest", async function (req, res) {
    requestData = req.body; // projectId, studentId
    try {
        if (requestData) {
            result = await DB.rejectRequest(requestData.projectId, requestData.studentId);
            if (result) {
                res.send({ msg: "Request rejected successfully" });
            } else {
                res.status(400).send({ msg: "Request is not rejected due to some error. please try again." });
            }
        }
        else{
            return res.status(400).send({ msg: "Please pass projectId and studentId" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.get('/requestStatusOfSpecProject/:projectId/:studentId', async function(req, res){
    requestData = req.params; // projectId, studentId
    try {
        if (requestData) {
            result = await DB.requestStatusOfSpecProject(requestData.projectId, requestData.studentId);
            if (result) {
                res.send(result);
            } else {
                res.status(400).send({ msg: "No request found" });
            }
        }
        else{
            return res.status(400).send({ msg: "Please pass projectId and studentId" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

module.exports = router;
