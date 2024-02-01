const jwt = require("jsonwebtoken")
const User = require("../models/usuarios.model")
const verifyToken = (req, res, next) => {
    try{
        const token = req.headers.token
        
        if(!token){
            return res.status(403).json({
                message:"token no encontrado"
            })
        }
        
        const decoded = jwt.verify(token,process.env.SECRET_NAME)

        const correo = User.getById(decoded.id_usuario)

        
        if(!correo){
            return res.status(404).json({
                message:"usuario no encontrado"
            })
        }
        next() 
    }catch(error){
        return res.status(401).json({
            message:"unauthorized"
        })
    }
}

module.exports = verifyToken