const jwt=require("jsonwebtoken")
const getToken=async(data)=>{
    return jwt.sign({
        data:data
    },`${process.env.SECRET_NAME}`,{
        expiresIn:"1460.002h"
    })
}

const getTokendata=async(token)=>{
    let data=null
    jwt.verify(token,`${process.env.SECRET_NAME}`,(err,decoded)=>{
        if(err){
            return data
        }else{
            data=decoded
        }
    })
    return data
}

module.exports={
    getToken,
    getTokendata
}