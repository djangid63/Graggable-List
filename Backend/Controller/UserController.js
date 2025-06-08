const usermodel = require('../Model/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = process.env.secret
const googleTTS = require('google-tts-api')
const {sendOtpEmail} = require('../Utils/EmailService')
const sendermail = process.env.user
const mailkey = process.env.pass


exports.sendingdata = async (req, res) => {

    const {name, email, password, age, gender} = req.body

    const user = await usermodel.findOne({email})

    if(user){
        return res.status(400).json({message : "email is exists"})
    }

   const salt = bcrypt.genSaltSync(10)
   const hash = bcrypt.hashSync(password, salt)

    let otp = ""

   for(let i = 0; i<6; i++){
        otp += Math.floor(Math.random() * 10)
    }

    const emailsent = await sendOtpEmail(
        email,
        otp,
        name,
        sendermail,
        mailkey
    )

    if (!emailsent) {
        return res.status(500).json({ message: "Failed to send OTP email" });
    }

   const datasave = new usermodel({name, email, password : hash, age, gender, otp})
    await datasave.save()

    return res.status(200).json({message : "data has been saved"})

}

exports.logindata = async(req, res) =>{

    const {email, password} = req.body

    const user = await usermodel.findOne({email})

    if(!user){
        return res.status(400).json({message : "email not found"})
    }

    const match = bcrypt.compareSync(password, user.password)

    if(!match){
        return res.status(400).json({message : "password not match"})
    }

    const token = jwt.sign({email: user.email, id : user._id},secret, {expiresIn: '12h'} )

    const userdata = {
        message: "login successful",
        token,
        email: user.email
    }

    return res.status(200).json(userdata)

}

exports.otpdata = async(req, res) => {

    const {email, otp} = req.body

    const user = await usermodel.findOne({email})

    if(!user){
        return res.status(200).json({message: "email is exist already"})
    }

    if(otp !== user.otp){
        return res.status(400).json({message : "otp not match"})
    }

    return res.status(200).json({message: "otp match successfully"})
  

}


exports.texttospeech = async(req, res) =>{

    const {text} = req.body

    const url = googleTTS.getAudioUrl(text, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com',
      });
      console.log(url);

      if(!url){
        return res.status(400).json({message : "error"})
      }

      return res.status(200).json({message : "done", urladdress : url})
}

exports.passwordupdate = async(req, res) => {

    const {newPassword ,oldPassword, email} = req.body

    const user = await usermodel.findOne({email})

    if(!user){
        return res.status(400).json({message: "user not found"})
    }

   const ismatch = bcrypt.compareSync(oldPassword, user.password)

   if(!ismatch){
    return res.status(400).json({message: "password not match"})
   }

   const salt = bcrypt.genSaltSync(10)
   const hash = bcrypt.hashSync(newPassword, salt)

    user.password = hash
    await user.save()

    return res.status(200).json({message : "passowrd is updated successfully"})
}

exports.dataupdate = async(req, res) => {
    const {name, age, email} = req.body

    console.log(`>>>req.body>>>`, req.body)

    const user = await usermodel.findOne({email})

    if(!user){
        return res.status(400).json({message : "user not found"})
    }

    await usermodel.findOneAndUpdate(
        {email},
        {name,age},
        {new : true}
    )
    return res.status(200).json({message: "update is successfully done"})
    
}