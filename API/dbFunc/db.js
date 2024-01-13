var mysql2 = require('mysql2');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

// const connection = mysql2.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'bookmycelebration',
//     port: '3308'
// }).promise();


// ================== Start of user ================== //
async function getUser(username) {
    result = {
        Username: username,
        rating: 4.5,
        email: "shivang02052005@gmail.com",
        contact: "1234567890",
        department: "Computer Engineering",
        year: "First Year",
    }
    if (username === "Shivang") {
        return result;
    } else {
        return false;
    }
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        //lavamwbdgvqvemup
        user: 'smart20072020@gmail.com',
        pass: 'lavamwbdgvqvemup'
    }
});

async function searchUser(email) {
    result = 'founded';
    //When no user will found in result then it will return false
    if (result) {
        return true;
    }
    return false;
}

async function registerUser({ username, email, password }) {
    //Register user in database as well as send email to user for verification and also generate activation token for verification which contain username or userid which is unique
    //Add user into database with verification 0

    //generate activation token
    const token = jwt.sign({
        data: `${username}`
    }, 'ourSecretKey', { expiresIn: '5m' });

    const mailConfigurations = {
        from: 'smart20072020@gmail.com',
        to: `${email}`,
        subject: 'Email Verification',
        html: `<div style="background: white; border-radius: 10px; text-align: center; padding: 20px; box-shadow: 0px 0px 100px rgb(69, 69, 69); font-family: Arial, Helvetica, sans-serif;">
                    <img src="https://raw.githubusercontent.com/ShivangKPatel/bookMyCelebration/shivang/public/webSiteLogo.png" style="height: 50px; width: 250px;">
                    <h3>Hi! There, welcome to Student Collabration.</h3>
                    <h4>May be you have registered yourself on our platform and so here is a email verification for you.</h4>
                    <button style="padding: 10px; border: 0px; border-radius: 10px;">
                        <a href="http://localhost:3000/user/verify/${token}" style="text-decoration: none; color: blue; background-color: whitesmoke;">Click Here for verification</a>
                    </button>
                    <p>Thanks for registering with us.</p>
                </div>`
    };
    transporter.sendMail(mailConfigurations, function(error, info) {
        if (error) throw Error(error);
        console.log('Email Sent Successfully');
    });

    return true;
}

async function Login({ username, password }) {
    return true;
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
        department: "Computer Engineering, Mechanical engineering, Electrical Engineering, Business Administration",
    }
    return result;
}
// ================== End of project ================== //

module.exports = { searchUser, getUser, registerUser, Login, getProject }