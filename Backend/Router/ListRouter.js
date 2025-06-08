const express = require('express')
const router = express.Router()
const listcontroller = require('../Controller/ListController')
const auth = require('../Middleware/Auth')

router.post('/addinglist', auth, listcontroller.addinglist)

router.get('/getalllists', auth, listcontroller.getalllists)

router.get('/getalldata', listcontroller.getall )

router.delete('/deletelist/:id', auth, listcontroller.deletelist)

module.exports = router