const deptController=require("../controllers/dept.controller")
const verifyToken = require("../middlewares/auth.middleware")
const express= require ("express")


const router=express.Router()

router.get("/dept",deptController.index)
router.get("/dept/:id",verifyToken,deptController.getById)
router.post("/dept",verifyToken,deptController.createDept)
router.get("/nueva",verifyToken,deptController.getNuevosDept)
router.patch("/apartar/:id",verifyToken,deptController.apart)
router.patch("/comprobacion",verifyToken,deptController.comprobarFecha)
module.exports=router