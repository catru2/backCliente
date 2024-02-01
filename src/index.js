require("dotenv").config();
require("./configs/db.config")  
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload')
const PORT = process.env.PORT;
const cors= require ('cors')


const userRoute=require("./routes/usuario.route")
const deptRoute= require("./routes/dept.route")

app.use(cors())
app.use (express.json())

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./dept_imagen",
}));


app.use(express.urlencoded({extended:false}))

app.use("/airbnb",userRoute,deptRoute)




app.listen(PORT,()=>{
    console.log(`El servidor esta funcionando en el puerto `+ PORT)
})