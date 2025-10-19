import express from "express"
import mongoose from "mongoose"
import studentRouter from "./routes/studentRouter.js"
import userRouter from "./routes/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routes/productRouter.js"

let mongoURI = "mongodb+srv://admin:123@cluster0.lsam6i7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoURI).then(() => { //connect to mongoDB cluster
    console.log("Connected to Mongo DB Cluster")
})

let app = express()
app.use(express.json()) //Express cannot understand JSON data sent from the client.This line tells Express to automatically parse JSON data that comes in the body of an HTTP request.

app.use((req, res, next) =>{

    const authorizationHeader = req.header("Authorization") 

    if(authorizationHeader != null){

        const token = authorizationHeader.replace("Bearer " , "")

        jwt.verify(token , "secretKey96$2025" ,
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

app.use("/students",studentRouter)
app.use("/users" , userRouter)
app.use("/products" , productRouter)


app.listen(3000, () => {
    console.log("server is running")
})