const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const authentication = require('../middleware/verifyToken');

// get tasks for authenticated user
router.get('/', authentication, async (req, res) => {
    try{
        const tasks = await Task.find({ userId: req.user._id });;
        res.json(tasks);
    } catch(error){
        res.status(500).send('Error getting tasks');
    }
});

router.post('/', authentication, async (req, res) => {
    const { taskDescription } = req.body;
    console.log('req.body in backend: ', req.body);
    try{
        const newTask = new Task({ userId: req.user._id, taskDescription, completion: false });
        await newTask.save();
        res.status(201).json(newTask);
    } catch(error){
        console.error("Error creating task:", error);
        res.status(400).json({error: 'Error creating task'});
    }
});

router.put('/:id', authentication, async (req, res) => {
    const {taskDescription, completion} = req.body;
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json('Task not found');
        }
        // check if task belongs to user
        if(task.userId.toString() !== req.user._id){
            return res.status(403).json('Unauthorized');
        }

        // update task
        task.taskDescription = taskDescription || task.taskDescription;
        task.completion = completion !== undefined ? completion : task.completion;
        await task.save();
        res.json(task);
    }
    catch(error){
        res.status(400).json('Error updating task');
    }
});

router.delete('/:id', authentication, async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).send('Task not found');
        }
        // check if task belongs to user
        if(task.userId.toString() !== req.user._id){
            return res.status(403).send('Unauthorized');
        }
        await task.deleteOne();
        res.status(204).json('Task deleted');
    } catch(error){
        res.status(400).json('Error deleting task');
    }
});

module.exports = router;