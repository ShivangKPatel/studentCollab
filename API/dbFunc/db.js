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

// ================== Start of user ================== //
async function getUser(username) {
    result = {
        Username: username,
        rating: 4.5,
        email: "shivang02052005@gmail.com",
        contact: "1234567890",
        department: "Computer Engineering",
        year: "First Year",
    };
    if (username === "Shivang") {
        return result;
    } else {
        return false;
    }
}

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        //lavamwbdgvqvemup
        user: "smart20072020@gmail.com",
        pass: "lavamwbdgvqvemup",
    },
});

async function searchUser(email, username) {
    [result] = await connection.query(
        `SELECT * FROM student WHERE email = '${email}' or username = '${username}'`
    );

    if (result.length != 0) {
        return false;
    }
    return true;
}

async function registerUser({ username, email, password }) {
    //Register user in database as well as send email to user for verification and also generate activation token for verification which contain username or userid which is unique
    //Add user into database with verification 0
    await connection.query(
        `INSERT INTO student (username, email, password, verified) VALUES ('${username}', '${email}', '${password}', 0)`
    );

    const [result] = await connection.query(
        `select student_id from student where email = '${email}'`
    );

    // generate activation token
    const token = jwt.sign(
        {
            data: `${result[0].student_id}`,
        },
        "ourSecretKey",
        { expiresIn: "5m" }
    );

    const mailConfigurations = {
        from: "smart20072020@gmail.com",
        to: `${email}`,
        subject: "Email Verification",
        html: ` <div style='align-item: center; text-align: center;'>
                      <div style="width: 400px; margin: 20px; background: white; border-radius: 10px; text-align: center; padding: 20px; box-shadow: 0px 0px 20px rgb(69, 69, 69); font-family: Arial, Helvetica, sans-serif;">
                          <img src="https://raw.githubusercontent.com/ShivangKPatel/bookMyCelebration/shivang/public/webSiteLogo.png" style="height: 50px; width: 250px;">
                          <h3>Hi! There, welcome to Student Collabration.</h3>
                          <h4>May be you have registered yourself on our platform and so here is a email verification for you.</h4>
                          <button style="padding: 10px; border: 0px; border-radius: 10px;">
                              <a href="http://localhost:3010/user/verify/${token}" style="text-decoration: none; color: blue; background-color: transparent;">Click Here for verification</a>
                          </button>
                          <p>Thanks for registering with us.</p>
                      </div>
                  </div>`,
    };
    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        console.log("Email Sent Successfully");
    });

    return true;
}

function verifyUser(student_id) {
    //Update the verified column in database
    connection.query(
        `UPDATE student SET verified = 1 WHERE student_id = ${student_id}`
    );
}

function updatePassword({ username, password }) {
    //Update the password in database
    try {
        connection.query(
            `UPDATE student SET password = '${password}' WHERE username = '${username}'`
        );
    } catch (err) {
        return false;
    }
    return true;
}

async function forgotPassword(email) {
    [result] = await connection.query(
        `select * from student where email = '${email}'`
    );
    result = result[0];
    //if email is founded in user then genrate a passowrd and send it to user

    var passcode = generator.generate({
        // New temporary password is generated
        length: 10,
        numbers: true,
        uppercase: true,
        lowercase: true,
        strict: true,
    });
    //Update the password in database with new temporary password and send email to user for verification and also generate activation token for verification which contain username of user which is unique
    connection.query(
        `UPDATE student SET password = '${passcode}' WHERE email = '${email}'`
    );

    //generate activation token and sending data to user
    const token = jwt.sign(
        {
            data: `${passcode}`,
        },
        "ourSecretKey",
        { expiresIn: "5m" }
    );

    const mailConfigurations = {
        from: "smart20072020@gmail.com",
        to: `${email}`,
        subject: "Forgot Password",
        html: ` <div style='align-item: center; text-align: center;'>
                    <div style="width: 400px; margin: 20px; background: white; border-radius: 10px; text-align: center; padding: 20px; box-shadow: 0px 0px 20px rgb(69, 69, 69); font-family: Arial, Helvetica, sans-serif;">
                        <img src="https://raw.githubusercontent.com/ShivangKPatel/bookMyCelebration/shivang/public/webSiteLogo.png" style="height: 50px; width: 250px;">
                        <h3>Hi! There, Forgot password request.</h3>
                        <h4>May be you have sended a request for change a password because you forgotted your password.</h4>
                        <button style="padding: 10px; border: 0px; border-radius: 10px;">
                            <a href="http://localhost:3010/user/forgotpassword/${token}" style="text-decoration: none; color: blue; background-color: transparent;">Click Here for get the temporary password for login</a>
                        </button>
                        <p>Thanks for reaching us.</p>
                    </div>
                </div>`,
    };
    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        console.log("Email Sent Successfully");
    });

    return true;
}

async function Login({ username, password }) {
    //Login user in database
    [result] = await connection.query(
        `select * from student where username = '${username}' and password = '${password}'`
    );
    result = result[0];
    if (result) {
        return true;
    }
    return false;
}

async function isVerified(username) {
    //Check whether user is verified or not
    [result] = await connection.query(
        `select * from student where username = '${username}'`
    );
    result = result[0];
    if (result.verified) {
        return true;
    }
    return false;
}

// ================== End of user ================== //

// ================== Start of project ================== //
async function getProject({ projectId }) {
    result = {
        projectId: projectId,
        projectname: "Counting the number of people in the room",
        rating: 4.5,
        hostby: "shivang02052005@gmail.com",
        reqStuNum: 10,
        department:
            "Computer Engineering, Mechanical engineering, Electrical Engineering, Business Administration",
    };
    return result;
}
// ================== End of project ================== //

module.exports = {
    searchUser,
    getUser,
    registerUser,
    Login,
    forgotPassword,
    verifyUser,
    isVerified,
    updatePassword,
    getProject,
};
