"use client";

import React, { useState, useEffect, use } from "react";
import { updateTasks } from "@/actions/task.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EditPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  async function getTaskById() {
    try {
      const res = await fetch(`/api/tasks/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch task");
      }
      const data = await res.json();
      if (!data.task) {
        throw new Error("Task not found");
      }
      setFormData({
        title: data.task.title,
        content: data.task.content,
        date: data.task.date,
      });
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  async function handleUpdateTask(formData) {
    try {
      const result = await updateTasks(id, formData);
      const response = JSON.parse(result);
      if (response.error) {
        throw new Error(response.error);
      }
      router.push("/");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  useEffect(() => {
    getTaskById();
  }, [id]);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-5 max-w-4xl mx-auto">
      <form className="w-full flex flex-col gap-5" action={handleUpdateTask}>
        <input
          defaultValue={formData.title}
          className="border border-gray-800 p-2 rounded-[5px] text-xl font-bold"
          type="text"
          name="title"
          placeholder="Title..."
          required
        />
        <textarea
          defaultValue={formData.content}
          placeholder="Enter your task..."
          className="border border-gray-800 p-2 rounded-[5px] text-lg font-medium"
          name="content"
          required
        ></textarea>
        <input
          defaultValue={formData.date}
          className="w-[15%] cursor-pointer border border-black text-black p-1 rounded-[5px]"
          name="date"
          type="date"
          required
        />
        <Button className="cursor-pointer" type="submit">
          Edit
        </Button>
      </form>
    </div>
  );
}
