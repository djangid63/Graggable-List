const jwt = require('jsonwebtoken')
const secret = process.env.secret
const usermodel = require('../Model/UserModel')

module.exports = async(req, res, next) => {

    const barrertoken = req.headers.authorization

    if(!barrertoken){
        return res.status(400).json({message: "barreer token not found"})
    }

    const token = barrertoken.split(" ")[1]

    if(!token){
        return res.status(400).json({message: "token not found"})
    }

    const decode = jwt.verify(token, secret)

    if(!decode){
        return res.status(400).json({message: "decode error"})
    }

    const user = await usermodel.findOne({email : decode.email})

    if(!user){
        return res.status(400).json({message: "email not found"})
    }

    req.user = user
    req.userid = decode.id

    next()
}

