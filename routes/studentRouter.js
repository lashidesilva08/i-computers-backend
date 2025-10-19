import express from "express"
import { createStudent, deleteStudent, updateStudent, viewStudent } from "../controllers/studentController.js"

const studentRouter = express.Router()

studentRouter.get("/", viewStudent)

studentRouter.post("/", createStudent)

studentRouter.delete("/", deleteStudent)

studentRouter.put("/", updateStudent)

export default studentRouter