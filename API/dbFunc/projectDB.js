var mysql2 = require("mysql2");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
var generator = require("generate-password");

const connection = mysql2
    .createPool({
        host: "localhost",
        user: "root",
        password: "root",
        database: "student-collab",
        port: "3308",
    })
    .promise();

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        //lavamwbdgvqvemup
        user: "smart20072020@gmail.com",
        pass: "lavamwbdgvqvemup",
    },
});

async function getProject(projectId) {
    [result] = await connection.query(
        `select project_id, projectName, projectDef, projectDesc, createDate, noOfStuJoined, noOfStuReq, requiredDep, stuReqByDep, hostedBy, projectLevel, rating, estTimeToComp from project where project_id = '${projectId}'`
    );
    return result;
}

async function validteProjectName(projectName, hostedBy) {
    // Check for project name is already taken by this host
    // [result] = await connection.query(
    //     `select project_id from project where project_name = '${projectName}' and hosted_by = '${hostedBy}'`
    // );
    //if true then project name is already taken by this host
    // if (result.length != 0) return true;
    return false;
}

async function createProject(projectData) {
    try {
        await connection.query(
            `INSERT INTO project (projectName, projectDef, projectDesc, hostedBy, createDate, noOfStuReq, estTimeToComp, projectLevel) VALUES ('${projectData.projectName}', '${projectData.projectDefination}', '${projectData.projectDescription}', '${projectData.hostedBy}', '${projectData.hostedDate}', '${projectData.noOfStudentRequired}', '${projectData.timeToComp}', '${projectData.projectLevel}')`
        );
        [result] = await connection.query(
            `select project_id from project where projectName = '${projectData.projectName}' and hostedBy = '${projectData.hostedBy}'`
        );
        result = result[0];
        return result;
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports = {
    getProject,
    validteProjectName,
    createProject,
};
