import mongoose, { Schema, models } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const Task = models.Task || mongoose.model("Task", taskSchema);

export default Task;