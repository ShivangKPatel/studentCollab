/*
        This file contain the routes for the user
        /user/getUser           => Input: username                    => Output: User data                       => method: GET
        /user/register          => Input: username, email, password   => Output: User registered successfully    => method: POST
        /user/login             => Input: username, password          => Output: User logged in successfully     => method: POST
        /user/verify            => Input: token                       => Output: Email verifified successfully   => method: GET
        /user/forgotpassword    => Input: email                       => Output: Email sent successfully         => method: POST
        /user/updatepassword    => Input: Username, password          => Output: Password updated successfully   => method: POST
*/

const bodyParser = require("body-parser");
const express = require("express");
const DB = require("../dbFunc/db.js");
const jwt = require("jsonwebtoken");

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/register", async function (req, res) {
    const userData = req.body;
    try {
        //Check for username, email and password
        if (!userData.username || !userData.email || !userData.password) {
            return res
                .status(400)
                .send({ msg: "Please pass username, email and password" });
        }

        //Check for user is not already registered
        result = await DB.searchUser(userData.email, userData.username);
        if (!result) {
            return res.status(400).send({
                msg: "Username or email already exists please try with another username or email",
            });
        }

        //Register the user
        result = await DB.registerUser(userData);
        if (result) {
            return res.send({ msg: "User registered successfully" });
        } else {
            return res.send({ msg: "User is not registered." });
        }
    } catch (err) {
        console.log(err);
    }
});

router.post("/login", async function (req, res) {
    const userData = req.body; // Username and Password
    try {
        //Check for username, email and password
        if (!userData.username || !userData.password) {
            return res
                .status(400)
                .send({ msg: "Please pass username and password" });
        }

        //Check for usercredentials
        result = await DB.Login(userData);
        if (result) {
            result = await DB.isVerified(userData.username);
            if (!result) {
                return res.status(400).send({
                    msg: "Email sent to your mail address. Please verify your email address before login",
                });
            }
            return res.send({ msg: "User logged in successfully" });
        } else {
            return res.status(400).send({ msg: "Wrong Credentails." });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.get("/verify/:token", async function (req, res) {
    // Verification link for creating new Account (Registration link)
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).send({ msg: "Please pass token" });
        }

        // Verifying the JWT token
        jwt.verify(token, "ourSecretKey", function (err, decoded) {
            if (err) {
                console.log(err);
                res.status(400).send(
                    "Email verification failed, possibly the link is invalid or expired "
                );
            } else {
                // Updating the verified column in database
                DB.verifyUser(decoded.data);
                res.send(
                    "Email verified successfully now you can login with your credentials"
                );
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.post("/forgotpassword", async function (req, res) {
    const userData = req.body; // Email address

    try {
        if (!userData.email) {
            return res.status(400).send({ msg: "Please pass email" });
        }

        if (!DB.searchUser(userData.email)) {
            return res.status(400).send({
                msg: "Linked account with this email does not exist",
            });
        }

        Status = await DB.forgotPassword(userData.email);
        if (Status) {
            res.send({ msg: "Email sent successfully" });
        } else {
            res.send({ msg: "Email not sent" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.get("/forgotpassword/:token", async function (req, res) {
    const { token } = req.params;
    try {
        jwt.verify(token, "ourSecretKey", function (err, decoded) {
            if (err) {
                console.log(err);
                res.status(400).send(
                    "Email verification failed, possibly the link is invalid or expired "
                );
            } else {
                res.send(
                    `<div style='width: 300px; text-align: center; margin: 30px; background: white; border-radius: 10px; text-align: center; padding: 20px; box-shadow: 5px 5px 40px rgb(69, 69, 69); font-family: Arial, Helvetica, sans-serif;'>
                        <h3 style='font-size: 20px;'>Temporay password: <h3 style='font-size:20px; color: green;'>${decoded.data}<h3></h3>    
                        <p style='font-size: 16px;'>you can change it by logging into the system.</p>
                    </div>`
                );
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.post("/updatepassword", async function (req, res) {
    const userData = req.body;
    try {
        if (!userData.username || !userData.password) {
            return res
                .status(400)
                .send({ msg: "Please pass email and password" });
        }

        Status = DB.updatePassword(userData);
        if (Status) {
            res.send({ msg: "Password updated successfully" });
        } else {
            res.status(400).send({ msg: "Password not updated" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.get("/getUser", async function (req, res) {
    userData = req.params.username; //username
    userData = req.query.username; //username
    try {
        if (!userData) {
            return res.status(200).send({ msg: "Please pass username" });
        }

        //Search user data by username from database
        result = await DB.getUser(userData);
        if (result) {
            res.send(result);
        } else {
            res.send({ msg: "User not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

module.exports = router;
