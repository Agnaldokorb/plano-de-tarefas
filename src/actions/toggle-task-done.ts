"use server";

import { prisma } from "@/utils/prisma";

export const toggleTaskDone = async (
  taskId: string,
  done: boolean,
  userId: string,
) => {
  if (!userId) {
    console.error("userId is required");
    return false;
  }

  try {
    // Verificar se a tarefa pertence ao usuário
    const existingTask = await prisma.tasks.findUnique({
      where: { id: taskId },
    });

    if (!existingTask || existingTask.userId !== userId) {
      console.error("Task not found or does not belong to user");
      return false;
    }

    await prisma.tasks.update({
      where: { id: taskId },
      data: { done: !done },
    });

    return true;
  } catch (error) {
    console.error("Error toggling task done:", error);
    return false;
  }
};
