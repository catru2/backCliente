const usuarioController =require("../controllers/usuarios.controller")
const express = require("express");
const  verifyToken  = require("../middlewares/auth.middleware")
const router = express.Router()     

router.get ("/usuarios",verifyToken,usuarioController.index)
router.post("/usuarios",usuarioController.createUser)
router.post("/signin",usuarioController.signIn)




module.exports=router