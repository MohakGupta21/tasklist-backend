import TaskModel from "../Models/taskModel.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import UserModel from "../Models/userModel.js";

// create new Task
export const createTask = async(req,res)=>{
    const {email,title,desc,status} = req.body;
    const user = await UserModel.findOne({email:email});

    if(user){
        const now = new Date();
        const newTask = new TaskModel({title,desc,status,userId:user._id,createdAt:now})
        const taskObject = newTask.toObject();
        const {userId,...otherDetails} = taskObject;
        console.log(otherDetails);
        try {
            await newTask.save();

            // Add new task and convert it into a jwt
            let jwtSecretKey = process.env.JWT_SECRET_KEY;

            const taskList = await getAllTasks(user._id);
    
            let data = {
                time: Date(),
                tasks: taskList,
                user_email: user.email,
            }
        
            const token = jwt.sign(data, jwtSecretKey);
        
            res.status(200).json({token:token});
        } catch (error) {
            res.status(500).json({error:error.message});
        }
    }
    else{
        res.status(500).json({error:'no user found'});
    }
}

// Get a Task
export const getAllTasks = async(user_id)=>{

    try {
        const task = await TaskModel.find({userId:user_id}).select('-userId');
        console.log(task);
        return task;
    } catch (error) {
        throw error;
    }
}

// update a Task
export const updateTask = async(req,res)=>{
    const TaskId = req.params.id;
    console.log(TaskId);
    const {email,...other} = req.body;
    console.log(other);
    // console.log(email);
    const user = await UserModel.findOne({email:email})
    // console.log(user);
    try {

        const Task = await TaskModel.findById(TaskId);
        console.log(Task.userId);
        console.log(user._id.toString());
        if(user._id.toString() === Task.userId){
            await Task.updateOne({$set : other})

            let jwtSecretKey = process.env.JWT_SECRET_KEY;

            const taskList = await getAllTasks(user._id);
    
            let data = {
                time: Date(),
                tasks: taskList,
                user_email: user.email,
            }
        
            const token = jwt.sign(data, jwtSecretKey);
        
            res.status(200).json({token:token});
        }
        else{
            res.status(500).json({message: 'user not found'})
        }
    
    } catch (error) {
        res.status(500).json({error:error.message});
        
    }
}

export const updateTaskStatus =async(req,res)=>{
    const taskId = req.params.id;
    const { status,email } = req.body;
    
    const user = await UserModel.findOne({email:email});
    try {
        const Task = await TaskModel.findById(taskId);

        if(user._id.toString() === Task.userId){
            await TaskModel.findByIdAndUpdate(taskId, { status });

            let jwtSecretKey = process.env.JWT_SECRET_KEY;
      
            const taskList = await getAllTasks(user._id);
      
            let data = {
                time: Date(),
                tasks: taskList,
                user_email: user.email,
            }
        
            const token = jwt.sign(data, jwtSecretKey);
        
            res.status(200).json({token:token});
        }
        else{
            res.status(500).json({message: 'user not found'});
        }
      
    } catch (error) {
      res.status(500).send('Error updating task status');
    }
}

// delete Task
export const deleteTask = async(req,res)=>{
    const { id } = req.params;
    const email = req.query.email;
    const user = await UserModel.findOne({email:email})
  
    try {
        const Task = await TaskModel.findById(id);
        if(user._id.toString() === Task.userId){
            await TaskModel.findByIdAndDelete(id);

            let jwtSecretKey = process.env.JWT_SECRET_KEY;

            const taskList = await getAllTasks(user._id);
    
            let data = {
                time: Date(),
                tasks: taskList,
                user_email: user.email,
            }
        
            const token = jwt.sign(data, jwtSecretKey);
        
            res.status(200).json({token:token});
        }
        else{
            res.status(500).json({message: 'user not found'})
        }

    } catch (error) {
      res.status(500).json({error:error.message});
    }
}

export const getTask = async(req,res)=>{
    const taskId = req.params.id;
    const email = req.query.email;

    const user = await UserModel.findOne({email:email});

    try {
        const Task = await TaskModel.findById(taskId);
        const {userId,...resp} = Task.toObject();
        if(user._id.toString() === Task.userId){
        
            res.status(200).json(resp);
        }
        else{
            res.status(500).json({message: 'user not found'})
        }

    } catch (error) {
      res.status(500).send('Error getting task');
    }

}
