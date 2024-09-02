import express from 'express';
import { createTask, deleteTask, getTask, updateTask, updateTaskStatus } from '../Controllers/TaskController.js';

const router = express.Router();

router.post('/',createTask);

router.put('/update/:id',updateTask);

router.delete('/delete/:id',deleteTask);

router.patch('/update/status/:id',updateTaskStatus);

router.get('/get/:id',getTask);


export default router;
