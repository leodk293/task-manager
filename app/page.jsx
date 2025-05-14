"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createTasks, deleteTasks, updateTasks } from "@/actions/task.actions";
import Link from "next/link";

export default function Home() {
  const [tasks, setTasks] = useState({
    error: false,
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  async function getTasks() {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setTasks({
        error: false,
        data: data.tasks,
      });
    } catch (error) {
      setTasks({
        error: true,
        data: [],
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  const handleCreateTask = async (formData) => {
    try {
      setLoading(true);
      const result = await createTasks(formData);
      const response = JSON.parse(result);

      if (response.error) {
        setMessage({ type: "error", text: response.error });
      } else {
        setMessage({ type: "success", text: response.message });
        getTasks(); // Refresh tasks after creation
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create task" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setLoading(true);
      const result = await deleteTasks(taskId);
      const response = JSON.parse(result);

      if (response.error) {
        setMessage({ type: "error", text: response.error });
      } else {
        setMessage({ type: "success", text: response.message });
        getTasks(); // Refresh tasks after deletion
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete task" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 flex flex-col items-center gap-5 max-w-4xl mx-auto">
      <h1 className="text-center text-2xl font-bold md:text-3xl">
        Welcome to Task Manager
      </h1>

      {message.text && (
        <div
          className={`w-full p-4 rounded ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {message.text}
        </div>
      )}

      <form className="w-full flex flex-col gap-5" action={handleCreateTask}>
        <input
          className="border border-gray-800 p-2 rounded-[5px] text-xl font-bold"
          type="text"
          name="title"
          placeholder="Title..."
          required
        />
        <textarea
          placeholder="Enter your task..."
          className="border border-gray-800 p-2 rounded-[5px] text-lg font-medium"
          name="content"
          required
        ></textarea>
        <input
          className="w-[15%] cursor-pointer border border-black text-black p-1 rounded-[5px]"
          name="date"
          type="date"
          required
        />
        <Button className="cursor-pointer" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </Button>
      </form>

      {loading ? (
        <p className="text-gray-800 text-xl">Loading tasks...</p>
      ) : tasks.error ? (
        <p className="text-red-800 text-xl">Something went wrong</p>
      ) : tasks.data.length === 0 ? (
        <p className="text-gray-800 text-xl font-medium italic">
          No tasks found...
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {tasks.data.map((task) => (
            <div
              key={task._id}
              className="border border-gray-800 flex flex-row gap-10 w-full p-2 rounded-[5px] text-lg font-medium"
            >
              <h2 className="text-xl self-center font-bold">{task.title}</h2>
              <p className="text-lg self-center font-medium">{task.content}</p>
              <p className="text-sm self-center font-medium">
                {new Date(task.date).toLocaleDateString()}
              </p>

              <div className="flex flex-row self-center gap-2">
                <Link href={`/edit/${task._id}`}>
                  <Button className="cursor-pointer" disabled={loading}>
                    Edit
                  </Button>
                </Link>

                <Button
                  onClick={() => handleDeleteTask(task._id)}
                  className="cursor-pointer"
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
