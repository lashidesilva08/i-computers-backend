import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import Otp from "../models/Otp.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "lashipentarithm@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
    }
})

export function createUser(req, res) {

    const data = req.body //Extracts the data sent in the request body and stores it in a constant named data.

    const hashedPassword = bcrypt.hashSync(data.password, 10)

    const user = new User({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashedPassword,

    })

    user.save().then(() => {
        res.json({
            message: "User created successfully"
        })
    })
}

export function loginUser(req, res) {

    const email = req.body.email
    const password = req.body.password

    User.find({
        email: email
    }).then(
        (users) => {
            if (users[0] == null) {
                res.status(404).json({
                    message: "User not found"
                })
            } else {
                const user = users[0]

                if(user.isBlocked){
                    res.status(403).json({
                    message: "User is blocked. Contact Admin"
                })
                return
                }

                const isPasswordCorrect = bcrypt.compareSync(password, user.password)

                if (isPasswordCorrect) {

                    const payload = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        isEmailVerified: user.isEmailVerified,
                        image: user.image

                    }

                    const token = jwt.sign(payload, process.env.JWT_SECRET)

                    res.json({
                        message: "Login successfull",
                        token: token,
                        role: user.role
                    })
                } else {
                    res.status(401).json({
                        message: "Invalid Password"
                    })
                }
            }
        }
    )
}

export function isAdmin(req) {

    if (req.user == null) {

        return false
    }
    if (req.user.role != "admin") {

        return false
    }
    return true
}

export function getUser(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized User"
        })
        return
    }
    res.json(req.user)
}

export async function googleLogin(req, res) {
    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        })
        console.log(response.data)

        const user = await User.findOne({
            email: response.data.email
        })

        if (user == null) {

            const newUser = new User({
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                password: "123",
                image: response.data.picture,
            })

            await newUser.save()

            const payload = {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                isEmailVerified: true,
                image: newUser.image

            }

            const token = jwt.sign(payload, process.env.JWT_SECRET)

            res.json({
                message: "Login successfull",
                token: token,
                role: user.role
            })

        } else {
            if(user.isBlocked){
                    res.status(403).json({
                    message: "User is blocked. Contact Admin"
                })
                return
                }

            const payload = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                image: user.image

            }

            const token = jwt.sign(payload, process.env.JWT_SECRET)

            res.json({
                message: "Login successfull",
                token: token,
                role: user.role
            })

        }
    } catch {
        res.status(500).json({
            message: "Google login failed",
            error: error.message
        })
    }
}

export async function sendOTP(req, res) {

    try {
        const email = req.params.email
        const user = await User.findOne({
            email: email
        })
        if (user == null) {
            res.status(404).json({
                message: "User not found"
            })
            return
        }
        await Otp.deleteMany({
            email: email
        })

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

        const otp = new Otp({
            email: email,
            otp: otpCode
        })

        await otp.save()

        const message = {
            from: "lashipentarithm@gmail.com",
            to: email,
            subject: "Your OTP Code",
            text: "Your OTP code is " + otpCode
        }
        transporter.sendMail(message, (err, info) => {
            if (err) {
                res.status(500).json({
                    message: "Failed to send OTP",
                    error: err.message
                })
                return
            } else {
                res.json({
                    message: "OTP sent successfully"
                })
                return
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to send OTP",
            error: error.message
        })
    }
}

export async function validateOTPAndUpdatePassword(req, res) {

    try {
        const otp = req.body.otp
        const newPassword = req.body.newPassword
        const email = req.body.email

        const otpRecord = await Otp.findOne({
            email: email,
            otp: otp
        })

        if (otpRecord == null) {
            res.status(500).json({
                message: "Invalid OTP"
            })
            return
        }
        await Otp.deleteMany({
            email: email
        })

        const hashedPassword = bcrypt.hashSync(newPassword, 10)

        await User.updateOne({
            email: email
        }, {
            $set: {
                password: hashedPassword,
                isEmailVerified: true
            }
        })
        res.json({
            message:"Password updated successfully!"
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to update password",
            error: error.message
        })
    }

}

export async function getAllUsers(req,res){
    if(!isAdmin(req)){
        res.status(401).json({
            message : "Unauthorized"
        })
        return
    }
    try{
        const users = await User.find()
        res.json(users)

    }catch(error) {
        res.status(500).json({
            message: "Failed to load users",
            error: error.message
        })
    }
}

export async function updateUserStatus(req,res){
     if(!isAdmin(req)){
        res.status(401).json({
            message : "Unauthorized"
        })
        return
    }
    const email = req.params.email
    if(req.user.email == email){
        res.status(400).json({
            message : "Admin cannot change their own status"
        })
    }
    const isBlocked = req.body.isBlocked

    try{
        await User.updateOne(
            {email : email},
            {$set:{isBlocked : isBlocked}}
        )
        res.json({
            message : "Status updated succesfully"
        })
    }catch(error) {
        res.status(500).json({
            message: "Failed to update status",
            error: error.message
        })
    }
}