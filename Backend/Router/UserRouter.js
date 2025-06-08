const express = require('express')
const router = express.Router()
const usercontroller = require('../Controller/UserController')
const auth = require('../Middleware/Auth')

router.post('/senddata', usercontroller.sendingdata)

router.post('/logindata', usercontroller.logindata)

router.post('/otpverify', usercontroller.otpdata)

router.post('/texttospeech', usercontroller.texttospeech)

router.post('/reset-password',auth, usercontroller.passwordupdate)

router.put('/update-profile', auth, usercontroller.dataupdate)

module.exports = router

