"use server";

import { prisma } from "@/utils/prisma";
import { parseTaskDateTime } from "@/lib/task-date-time";

const NewTask = async (
  task: string,
  description: string,
  userId: string,
  scheduledAt?: string | null,
) => {
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
        scheduledAt: parseTaskDateTime(scheduledAt),
      },
    });
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
};

export { NewTask };
