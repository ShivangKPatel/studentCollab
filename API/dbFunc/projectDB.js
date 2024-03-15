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
    result = result[0];
    return result;
}

async function validteProjectName(projectName, hostedBy) {
    // Check for project name is already taken by this host
    try {
        [result] = await connection.query(
            `select exists(select project_id from project where projectName = '${projectName}' and hostedBy = '${hostedBy}') as result;`
        );
        return result[0].result;
        // if true then project name is already taken by this host
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function createProject(projectData) {
    var datetime = new Date();
    currentDate = datetime.toISOString().slice(0, 10);
    try {
        await connection.query(
            `INSERT INTO project (projectName, projectDef, projectDesc, createDate, noOfStuReq, requiredDep, hostedBy, projectLevel, estTimeToComp) VALUES ('${projectData.projectName}', '${projectData.projectDefination}', '${projectData.projectDescription}', '${currentDate}', '${projectData.noOfStudentRequired}', '${projectData.reqDep}', '${projectData.hostedBy}', '${projectData.projectLevel}', '${projectData.timeToComp}')`
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

async function getAllProject() {
    try {
        [result] = await connection.query(
            `select p.project_id as pID, p.projectName as pName, p.projectDef as pDef, p.requiredDep as pReqDep, s.username as pHost, p.rating as pRating, p.projectLevel as pLevel, p.estTimeToComp as pTime FROM project p LEFT JOIN student s ON p.hostedBy = s.student_id`
        );
        return result;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    getProject,
    validteProjectName,
    createProject,
    getAllProject,
};
