import express from "express"
import mongoose from "mongoose"
import studentRouter from "./routes/studentRouter.js"
import userRouter from "./routes/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routes/productRouter.js"
import cors from "cors"
import dotenv from "dotenv"
import orderRouter from "./routes/orderRouter.js"

dotenv.config()

const mongoURI = process.env.MONGO_URL 

mongoose.connect(mongoURI).then(() => { //connect to mongoDB cluster
    console.log("Connected to Mongo DB Cluster")
})

let app = express()
app.use(express.json()) //Express cannot understand JSON data sent from the client.This line tells Express to automatically parse JSON data that comes in the body of an HTTP request.
app.use(cors())//It controls which domains (origins) are allowed to make requests to your backend API.(cross origin resource platform)
app.use((req, res, next) =>{

    const authorizationHeader = req.header("Authorization") 

    if(authorizationHeader != null){

        const token = authorizationHeader.replace("Bearer " , "")

        jwt.verify(token , process.env.JWT_SECRET ,
            (error , content) =>{

                if(content == null){

                    console.log("Invalid Token")
                    res.json({
                        message : "Inavalid Token"
                    })
                    
                }else{
                    
                    req.user = content
                    next()
                }
            }
        )

    }else{
        next()
    }
})

app.use("/api/students",studentRouter)
app.use("/api/users" , userRouter)
app.use("/api/products" , productRouter)
app.use("/api/orders" , orderRouter)


app.listen(3000, () => {
    console.log("server is running")
})