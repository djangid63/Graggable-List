const taskmodel = require('../Model/TaskModel')

exports.taskdata = async(req, res) => {
    const { listId, task } = req.body;

    if (!task || !listId) {
      return res.status(400).json({ message: 'Task or list ID missing' });
    }

    const newTask = await taskmodel.create({ listId, task });

    if(!newTask){
        return res.status(400).json({message: "tasks not added"})
    }

    return res.status(201).json({
        message: 'Task added successfully',
        data: newTask
      });
}

exports.showtasks = async(req, res) => {

    const listdata = await taskmodel.find()

    if(!listdata){
        return res.status(400).json({message: "not able to fetch tasks"})
    }

    return res.status(200).json({message: "all tasks fetch successfully !!", data : listdata})
}

exports.updatetasklist = async(req, res) =>{
    const { taskId } = req.params;
    const { listId } = req.body;

    const updated = await taskmodel.findByIdAndUpdate(taskId, { listId }, { new: true });

    if(!updated){
        return res.status(400).json({message: "error in updating"})
    }

    return res.status(200).json({ data: updated });
}

exports.edittasks = async(req,res) => {
    const {taskId} = req.params
    const {task} = req.body

    const updatetask = await taskmodel.findByIdAndUpdate(taskId, {task}, {new: true})

    if(!updatetask){
        return res.status(400).json({message : "error updating task"})
    }

    return res.status(200).json({message: "task updated successfully", data: updatetask})

}

exports.deletetasks = async(req,res) => {
    const {taskId} = req.params

    const updatetask = await taskmodel.findByIdAndDelete(taskId)

    if(!updatetask){
        return res.status(400).json({message : "error updating task"})
    }

    return res.status(200).json({message: "task updated successfully", data: updatetask})

}