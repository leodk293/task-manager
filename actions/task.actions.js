'use server';
import { connectMongoDB } from "@/lib/connectMongoDB";
import Task from "@/lib/models/task.model";
import { revalidatePath } from "next/cache"

export async function createTasks(formData) {
    try {
        await connectMongoDB();
        const title = formData.get("title");
        const content = formData.get("content");
        const date = formData.get("date");

        if (!title || !content || !date) {
            return JSON.stringify({ error: "All fields are required" });
        }
        await Task.create({ title, content, date });
        revalidatePath("/")
        return JSON.stringify({ message: "Task created successfully" });
    }
    catch (error) {
        console.error("Create task error:", error);
        return JSON.stringify({ error: `Failed to create task: ${error.message}` });
    }
}

export async function deleteTasks(taskId) {
    try {
        await connectMongoDB();
        await Task.findByIdAndDelete(taskId);
        revalidatePath("/")
        return JSON.stringify({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("Delete task error:", error);
        return JSON.stringify({ error: `Failed to delete task: ${error.message}` });
    }
}

export async function updateTasks(taskId, formData) {
    try {
        await connectMongoDB();
        const title = formData.get("title");
        const content = formData.get("content");
        const date = formData.get("date");
        
        if (!title || !content || !date) {
            return JSON.stringify({ error: "All fields are required" });
        }
        
        await Task.findByIdAndUpdate(taskId, { title, content, date });
        revalidatePath("/")
        return JSON.stringify({ message: "Task updated successfully" });
    }
    catch (error) {
        console.error("Update task error:", error);
        return JSON.stringify({ error: `Failed to update task: ${error.message}` });
    }
}