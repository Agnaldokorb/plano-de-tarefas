"use server";

import { prisma } from "@/utils/prisma";
import { parseTaskDateTime } from "@/lib/task-date-time";

export const EditTask = async (
  taskId: string,
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
    // Verificar se a tarefa pertence ao usuário
    const existingTask = await prisma.tasks.findUnique({
      where: { id: taskId },
    });

    if (!existingTask || existingTask.userId !== userId) {
      console.error("Task not found or does not belong to user");
      return null;
    }

    const newTask = await prisma.tasks.update({
      where: { id: taskId },
      data: {
        task,
        description,
        ...(scheduledAt !== undefined
          ? { scheduledAt: parseTaskDateTime(scheduledAt) }
          : {}),
      },
    });
    return newTask;
  } catch (error) {
    console.error("Error editing task:", error);
    return null;
  }
};
