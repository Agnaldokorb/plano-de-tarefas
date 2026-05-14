"use server";

import { prisma } from "@/utils/prisma";

const NewTask = async (task: string, description: string, userId: string) => {
  if (!userId) {
    console.error("userId is required");
    return null;
  }

  try {
    const newTask = await prisma.tasks.create({
      data: {
        task,
        description,
        userId,
      },
    });
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
};

export { NewTask };
