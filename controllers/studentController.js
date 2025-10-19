import Student from "../models/Student.js"
export function viewStudent(req, res) {

    if(req.user == null){
        res.json({
            message : "Cannot find user. Please try again"
        })
        return
    }
    if(req.user.role != "admin") {
         res.json({
            message : "Only Admin can see this"
        })
    }   

   

    Student.find().then((students) => {
        res.json(students)
    })
}

export function createStudent(req, res) {
    console.log(req.body) //Read the data inside the request
    const student = new Student(req.body)

    student.save().then(() => {
        res.json({
            message: "Student saved successfully"
        })
    })
}
export function deleteStudent(req, res) {
    res.json({
        message: "Goodbye" + req.body.name,
    })
}
export function updateStudent(req, res) {
    res.json({
        message: "See you again" + req.body.name,
    })
}