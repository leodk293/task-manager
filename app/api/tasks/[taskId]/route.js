import { connectMongoDB } from "@/lib/connectMongoDB";
import Task from "@/lib/models/task.model";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
    try {
        await connectMongoDB();
        const task = await Task.findById(params.taskId);
        
        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ task }, { status: 200 });
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}