"use server";

import { prisma } from "@/utils/prisma";

export const clearCompletedTasks = async (userId: string) => {
  if (!userId) {
    console.error("userId is required");
    return {
      success: false,
      count: 0,
    };
  }

  try {
    const result = await prisma.tasks.deleteMany({
      where: {
        done: true,
        userId,
      },
    });

    return {
      success: true,
      count: result.count,
    };
  } catch (error) {
    console.error("Error clearing completed tasks:", error);
    return {
      success: false,
      count: 0,
    };
  }
};
