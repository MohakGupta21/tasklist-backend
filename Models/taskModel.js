import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        userId: {type: String, required: true},
        status: {
            type: String,
            enum: ['in progress', 'done', 'todo'], // Allowed values
            required: true,
            default: 'todo', // Optional: set a default value
          },        
        title:String,
        desc: String
    },
    {
        timestamps:true
    });

var TaskModel = mongoose.model("Tasks",taskSchema);

export default TaskModel;