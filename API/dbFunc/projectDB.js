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
        // await connection.query(
        //     `INSERT INTO project (project_name, project_defination, project_description, project_creator, project_creation_date, no_of_student_required, no_of_student_joined, student_required_by_department, hosted_by, required_time, project_level) VALUES ('${projectData.projectName}', '${projectData.projectDefination}', '${projectData.projectDescription}', '${projectData.projectCreator}', '${projectData.projectCreationDate}', '${projectData.noOfStudentRequired}', '${projectData.noOfStudentJoined}', '${projectData.studentRequiredByDepartment}', '${projectData.hostedBy}', '${projectData.requiredTime}', '${projectData.projectLevel}')`
        // );
        return false;
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
