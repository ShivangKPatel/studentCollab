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
        `select project_id, projectName, projectDef, projectDesc, createDate, noOfStuJoined, noOfStuReq, requiredDep, stuReqByDep, hostedBy, projectLevel, p.rating, estTimeToComp, s.firstname as firstname, s.lastname as lastname from project p LEFT JOIN student s ON p.hostedBy = s.student_id where project_id = '${projectId}'`
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
            `select p.project_id as pID, p.projectName as pName, p.projectDef as pDef, p.requiredDep as pReqDep, s.username as pHost, p.rating as pRating, p.projectLevel as pLevel, p.estTimeToComp as pTime FROM project p LEFT JOIN student s ON p.hostedBy = s.student_id ORDER BY p.project_id DESC`
        );
        return result;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function updateProject(projectData) {
    try {
        await connection.query(
            `UPDATE project SET projectName = '${projectData.projectName}', projectDef = '${projectData.projectDefination}', projectDesc = '${projectData.projectDescription}', noOfStuReq = '${projectData.noOfStudentRequired}', requiredDep = '${projectData.reqDep}', projectLevel = '${projectData.projectLevel}', estTimeToComp = '${projectData.timeToComp}' WHERE project_id = '${projectData.projectId}'`
        );
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function sendRequest(projectId, studentId) {
    try {
        await connection.query(
            `INSERT INTO projectrequest (project_id, student_id) VALUES ('${projectId}', '${studentId}')`
        );
        [result] = await connection.query(
            `SELECT s.username as hUsername, s.email as hEmail, p.projectName as pName FROM student s, project p WHERE s.student_id = (SELECT hostedBy FROM project WHERE project_id = '${projectId}')`
        );
        const host = result[0];
        [result] = await connection.query(
            `SELECT s.username as sUsername, s.email as sEmail FROM student s WHERE s.student_id = '${studentId}'`
        );
        const student = result[0];

        const mailOptions = {
            from: student.sEmail,
            to: host.hEmail,
            subject: "Project Request Received",
            html: `<div style='align-item: center; text-align: center;'>
                        <div style="width: 400px; margin: 20px; background: white; border-radius: 10px; text-align: center; padding: 20px; box-shadow: 0px 0px 20px rgb(69, 69, 69); font-family: Arial, Helvetica, sans-serif;">
                            <img src="https://raw.githubusercontent.com/ShivangKPatel/bookMyCelebration/shivang/public/webSiteLogo.png" style="height: 50px; width: 250px;">
                            <h3>Hi! There, welcome to Student Collabration.</h3>
                            <h4>You have received an request on your project ${host.pName} from ${student.sUsername}. Please click on the following link to see the more details about it.</h4>
                            <button style="padding: 10px; border: 0px; border-radius: 10px;">
                                <a href="http://localhost:3010/project/getProjectRequest/${projectId}" style="text-decoration: none; color: blue; background-color: transparent;">Click Here for verification</a>
                            </button>
                            <p>Best regard</p><br>
                            <p>The project team</p>
                        </div>
                    </div>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return false;
            } else {
                console.log("Email sent: " + info.response);
                return true;
            }
        });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getProjectRequest(projectId) { // Get all the request you got on your project from students
    try {
        [result] = await connection.query(
            `select s.student_id, s.username, s.email, s.rating from student s, projectrequest p where p.project_id = '${projectId}' and p.student_id = s.student_id and p.requestStatus = '-1'`
        );
        return result;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function acceptRequest(projectId, studentId) {
    try {
        await connection.query(
            `UPDATE projectrequest SET requestStatus = '1' WHERE project_id = '${projectId}' and student_id = '${studentId}'`
        );
        
        [result] = await connection.query(
            `SELECT request_id FROM projectrequest WHERE project_id = '${projectId}' and student_id = '${studentId}'`
        );
        const requestId = result[0].request_id;

        // Get host details
        [result] = await connection.query(
            `SELECT s.username as hUsername, s.email as hEmail, p.projectName as pName FROM student s, project p WHERE p.project_id = '${projectId}' and p.hostedBy = s.student_id`
        );
        const host = result[0];

        // Get student details
        [result] = await connection.query(
            `SELECT s.username as sUsername, s.email as sEmail FROM student s WHERE s.student_id = '${studentId}'`
        );
        const student = result[0];
        
        // Compose email
        const mailOptions = {
            from: host.hEmail,
            to: student.sEmail,
            subject: "Project request accepted",
            html: `<div style='align-item: center; text-align: center;'>
                        <div style="width: 400px; margin: 20px; background: white; border-radius: 10px; text-align: center; padding: 20px; box-shadow: 0px 0px 20px rgb(69, 69, 69); font-family: Arial, Helvetica, sans-serif;">
                            <img src="https://raw.githubusercontent.com/ShivangKPatel/bookMyCelebration/shivang/public/webSiteLogo.png" style="height: 50px; width: 250px;">
                            <h3>Hi! There, welcome to Student Collabration.</h3>
                            <h4>Host of the project ${host.hUsername} has accepted your request to join ${host.pName}. Please click on the following link to see the more details about it.</h4>
                            <button style="padding: 10px; border: 0px; border-radius: 10px;">
                                <a href="http://localhost:3010/project/requestStatusOfSpecProject/${requestId}/${studentId}" style="text-decoration: none; color: blue; background-color: transparent;">Click Here for verification</a>
                            </button>
                        </div>
                    </div>
                    <p>Best regard</p>
                    <p>The project team</p>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return false;
            } else {
                console.log("Email sent: " + info.response);
                return true;
            }
        });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function rejectRequest(projectId, studentId) {
    try {
        await connection.query(
            `UPDATE projectrequest SET requestStatus = '0' WHERE project_id = '${projectId}' and student_id = '${studentId}'`
        );
        
        [result] = await connection.query(
            `SELECT request_id FROM projectrequest WHERE project_id = '${projectId}' and student_id = '${studentId}'`
        );
        const requestId = result[0].request_id;

        // Get host details
        [result] = await connection.query(
            `SELECT s.username as hUsername, s.email as hEmail, p.projectName as pName FROM student s, project p WHERE p.project_id = '${projectId}' and p.hostedBy = s.student_id`
        );
        const host = result[0];

        // Get student details
        [result] = await connection.query(
            `SELECT s.username as sUsername, s.email as sEmail FROM student s WHERE s.student_id = '${studentId}'`
        );
        const student = result[0];
        
        // Compose email
        const mailOptions = {
            from: host.hEmail,
            to: student.sEmail,
            subject: "Project request rejected",
            html: `<div style='align-item: center; text-align: center;'>
                        <div style="width: 400px; margin: 20px; background: white; border-radius: 10px; text-align: center; padding: 20px; box-shadow: 0px 0px 20px rgb(69, 69, 69); font-family: Arial, Helvetica, sans-serif;">
                            <img src="https://raw.githubusercontent.com/ShivangKPatel/bookMyCelebration/shivang/public/webSiteLogo.png" style="height: 50px; width: 250px;">
                            <h3>Hi! There, welcome to Student Collabration.</h3>
                            <h4>Host of the project ${host.hUsername} has rejected your request for join ${host.pName}. Please click on the following link to see the more details about it. <br> Best of luck for next time.</h4>
                            <button style="padding: 10px; border: 0px; border-radius: 10px;">
                                <a href="http://localhost:3010/project/requestStatusOfSpecProject/${requestId}/${studentId}" style="text-decoration: none; color: blue; background-color: transparent;">Click Here for verification</a>
                            </button>
                        </div>
                    </div>
                    <p>Best regard</p>
                    <p>The project team</p>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return false;
            } else {
                console.log("Email sent: " + info.response);
                return true;
            }
        });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function requestStatusOfSpecProject(requestId, studentId) {
    try {
        [result] = await connection.query(
            `select request_id, requestStatus from projectrequest where request_id = '${requestId}' and student_id = '${studentId}'`
        );
        return result;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function checkRequest(projectId, studentId) {
    try {
        [result] = await connection.query(
            `select exists(select request_id from projectrequest where project_id = '${projectId}' and student_id = '${studentId}') as result;`
        );
        return result[0].result;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function searchProject(searchKey) {
    // try{
    //     [result1] = await connection.query(
    //         `select department_id from department where departmentName LIKE '%${searchKey}%'`
    //     )
    // }catch(err){
    //     console.log(err);
    //     return false;
    // }

    try {
        [result] = await connection.query(
            `select p.project_id as pID, p.projectName as pName, p.projectDef as pDef, p.requiredDep as pReqDep, s.username as pHost, p.rating as pRating, p.projectLevel as pLevel, p.estTimeToComp as pTime FROM project p LEFT JOIN student s ON p.hostedBy = s.student_id WHERE p.projectName LIKE '%${searchKey}%' ORDER BY p.project_id DESC`
        );
        return result;
    } catch (err) {
        console.log(err);
        return false;
    }   
}

async function getProjectByHost(hostedBy) {
    try {
        [result] = await connection.query(
            `select project_id, projectName, projectDef, projectDesc, createDate, noOfStuJoined, noOfStuReq, requiredDep, stuReqByDep, hostedBy, projectLevel, p.rating, estTimeToComp, s.firstname as firstname, s.lastname as lastname from project p LEFT JOIN student s ON p.hostedBy = s.student_id where hostedBy = '${hostedBy}'`
        );
        return result;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getProjectByStudent(studentId) {
    try {
        [result] = await connection.query(
            `select p.project_id, p.projectName, p.projectDef, p.projectDesc, p.createDate, p.noOfStuJoined, p.noOfStuReq, p.requiredDep, p.stuReqByDep, p.hostedBy, p.projectLevel, p.rating, p.estTimeToComp, s.firstname as firstname, s.lastname as lastname from project p LEFT JOIN student s ON p.hostedBy = s.student_id where p.project_id IN (select project_id from projectrequest where student_id = '${studentId}')`
        );
        return result;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getJoinedByStudent(studentId) {
    try {
        [result] = await connection.query(
            `select p.project_id, p.projectName, p.projectDef, p.projectDesc, p.createDate, p.noOfStuJoined, p.noOfStuReq, p.requiredDep, p.stuReqByDep, p.hostedBy, p.projectLevel, p.rating, p.estTimeToComp, s.firstname as firstname, s.lastname as lastname from project p LEFT JOIN student s ON p.hostedBy = s.student_id where p.project_id IN (select project_id from projectrequest where student_id = '${studentId} and requestStatus = '1')`
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
    updateProject,
    sendRequest,
    getProjectRequest,
    acceptRequest,
    rejectRequest,
    requestStatusOfSpecProject,
    checkRequest,
    searchProject,
    getProjectByHost,
    getProjectByStudent,
    getProjectByStudent,
};
