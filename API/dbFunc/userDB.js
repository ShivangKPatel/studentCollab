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

async function getUser(username) {
    [result] = await connection.query(
        `select student_id, firstname, lastname, username, email, phone_no, departmentID, rating, noofrating, no_project_done, github, linkedin, resume from student where username = '${username}'`
    );
    result = result[0];
    if (result) return result;
    return false;
}

async function getUserForDiffUser({ who_stuID, whom_stuID }) {
    [result1] = await connection.query(
        `select exists(select ratingVal from rating where who = '${who_stuID}' and whom = '${whom_stuID}' and cat='0') as res`
    );
    //if who user gave an rating to whom user then it will return 1 and so that it goes to else as per written condition and value of rating will be 0 if no data found in rating table.
    if (!result1[0].res) {
        [result] = await connection.query(
            `select student_id, firstname, lastname, username, email, phone_no, departmentID, rating as overallRating, noofrating, no_project_done, github, linkedin, resume from student where student_id = '${whom_stuID}'`
        );
        result = result[0];
        result.ratingGivenByYou = 0;
    } else {
        [result] = await connection.query(
            `select student_id, firstname, lastname, username, email, phone_no, departmentID, rating as overallRating, noofrating, no_project_done, github, linkedin, resume, rating.ratingVal as ratingGivenByYou from student, rating where student_id = '${whom_stuID}' and rating.who = ${who_stuID} and rating.whom = ${whom_stuID}`
        );
        result = result[0];
    }

    // `select student_id, firstname, lastname, username, email, phone_no, departmentID, rating as overallRating, noofrating, no_project_done, github, linkedin, resume, rating.ratingVal as ratingGivenByYou from student, rating where student_id = '${whom_stuID}' and rating.who = '${who_stuID}' and rating.whom = '${whom_stuID}'`
    console.log(result);
    // result = result[0];
    // if (result) return result;
    return result;
}

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
        `INSERT INTO student (username, email, password, verified, departmentID) VALUES ('${username}', '${email}', '${password}', 0, 3)`
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

    // generate activation token
    const token = jwt.sign(
        {
            data: `${result.student_id}`,
        },
        "ourSecretKey",
        { expiresIn: "5m" }
    );

    const mailConfigurations = {
        from: "smart20072020@gmail.com",
        to: `${result.email}`,
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
    return false;
}

async function updateRating({ who_stuID, whom_stuID, rating }) {
    //Update user rating in database
    result = await connection.query(
        `SELECT EXISTS(select ratingVal from rating where who = '${who_stuID}' and whom = '${whom_stuID}' and cat='0') as res`
    );
    console.log(result[0][0].res);
    if (result[0][0].res) {
        //Already rating given by this user
        try {
            await connection.query(
                `UPDATE rating SET ratingVal = '${rating}' WHERE who = '${who_stuID}' and whom = '${whom_stuID}' and cat='0'`
            );
        } catch (err) {
            console.log(err);
            return false;
        }
    } else {
        try {
            await connection.query(
                `insert into rating (who, whom, ratingVal, cat) values ('${who_stuID}', '${whom_stuID}', '${rating}', '0')`
            );
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    try {
        connection.query(
            `Update student set rating = (select avg(ratingVal) from rating where whom = '${whom_stuID}' and cat='0') where student_id = '${whom_stuID}'`
        );
    } catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

async function updateUser({
    student_id,
    firstname,
    lastname,
    Username,
    email,
    phone_no,
    department,
    github,
    linkedin,
    resume,
}) {
    //Update user data in database
    try {
        await connection.query(
            `UPDATE student SET firstname = '${firstname}', lastname = '${lastname}', username = '${Username}', email = '${email}', phone_no = '${phone_no}', departmentID = '${department}', github = '${github}', linkedin = '${linkedin}' WHERE student_id = '${student_id}'`
        );
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    searchUser,
    getUser,
    registerUser,
    Login,
    forgotPassword,
    verifyUser,
    isVerified,
    updateUser,
    updatePassword,
    updateRating,
    getUserForDiffUser,
};
