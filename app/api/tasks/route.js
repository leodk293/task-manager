import { connectMongoDB } from "@/lib/connectMongoDB";
import Task from "@/lib/models/task.model";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectMongoDB();
        const tasks = await Task.find();
        return NextResponse.json({ tasks }, { status: 200 });
    }

    catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}