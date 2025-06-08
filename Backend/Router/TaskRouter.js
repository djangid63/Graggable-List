const express = require('express')
const router = express.Router()
const taskcontroller = require('../Controller/TaskController')
const auth = require('../Middleware/Auth')

router.post('/addtask', auth, taskcontroller.taskdata)

router.get('/showtasks', auth, taskcontroller.showtasks)

router.put('/updatelist/:taskId', auth, taskcontroller.updatetasklist)

router.put('/updatetask/:taskId', auth, taskcontroller.edittasks)

router.delete('/deletetask/:taskId', auth, taskcontroller.deletetasks)

module.exports = router