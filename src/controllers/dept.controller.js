const Dept= require("../models/dept.model")
const jwt = require("jsonwebtoken")
const fs=require("fs-extra")
const { uploadImage } = require("../configs/cloudinary.config")

let responsesClientes = [];

const index = async (req, res) => {
    try{
        const usuarios = await Dept.getAll();
        return res.status(200).json({
            message: "departamentos obtenidos correctamente",
            data: usuarios
        })
    }catch(error){
        return res.status(500).json({
        message: "error al obtener datos",
        error:error.message
        })
    }
}

const createDept = async (req,res) =>{
    try{
        console.log(req.body)
        const token=req.headers.token
        const decoded= jwt.verify(token,process.env.SECRET_NAME)
        
        let imagen=null
        if(req.files?.imagen){
            imagen=await uploadImage(req.files.imagen.tempFilePath)
            await fs.unlink(req.files.imagen.tempFilePath)
        } 
        const dept = new Dept({
            id_usuario: decoded.id,
            ubicacion: req.body.ubicacion,
            precio:req.body.precio,
            imagen: imagen.secure_url,
            created_by:decoded.id,
            created_at: new Date()
        })
        console.log(dept)
        await dept.save();
        return res.status(200).json({
            message:"publicacion del departamento creada correctamente",
            data:dept
        })
    }catch(error){
        return res.status(500).json({
            message:"error al crear publicacion",
            error:error.message
        })
    }
}
const apart = async (req,res)=>{
    try{ 
        const token=req.headers.token
        const decoded = jwt.verify(token, process.env.SECRET_NAME)
        console.log(req.body)
         
        const objeto = await Dept.getById(req.params.id);
        console.log(req.params.id)
        if(objeto.apartado){
            return res.status(404).json({
                massage:"El departamento ya ha sido apartado" 
            })
        }    
        const departamento = {
          id_usuario: decoded.id,
          apartado:true,
          inicioapart: new Date(),
          finalapart:req.body.finalapart
        }
        await Dept.updateByid(req.params.id,departamento);
        return res.status(200).json({
            message:"se aparto correctamente"
        })
    }catch(error){
        return res.status(500).json({
            message:"error al apartar",
            error: error.message
        })
    
    }
}

const getById = async(req,res)=>{
try{
  const {id} = req.params;
  const departamento=await Dept.getById(id);
  if(!departamento){
    return res.status(404).json({
        massage:"no se pudo encontrar al id" + id,
    })
  }
  return res.status(200).json({
    massage:"departamento obtenido correctamente",
    data:departamento
  })
    }catch(error){
        return res.status(500).json({
            massage:"error al obtener el departamento ",
            error:error.message
          })
    }
}

const comprobarFecha = async (req, res) => {
    try {
        const token=req.headers.token
        const decoded= jwt.verify(token,process.env.SECRET_NAME)
        const depts = await Dept.getAll();
        console.log(depts)
        for (const dept of depts) {
            if (dept.finalapart<(new Date())) {
                departamento = {
                    id_usuario: decoded.id,
                    apartado: false
                }
               await Dept.updateByid(dept.id, departamento);
            }
        }  return res.status(200).json({
            massage:"se ha la fecha de comprobacion obtenido correctamente",
            data:depts
          })
        
    }catch (error) {
        res.status(500).json({
            massage:"error al obtener la comprobacion",
            error:error.message
        });
  }
}

function responderNotificacion(notificacion) {
    for (res of responsesClientes) {
        res.status(200).json({
            success: true,
            notificacion
        });
    }

    responsesClientes = [];
}

const getNuevosDept = (req, res) => {
    responsesClientes.push(res);
    // [res1, res2, res3]
    req.on('close', () => {
        const index = responsesClientes.length; 
        responsesClientes = responsesClientes.slice(index, 1);
    });
}


module.exports={
    index,
    createDept,
    getNuevosDept,
    apart,
    getById, 
    comprobarFecha
}