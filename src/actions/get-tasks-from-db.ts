"use server";

import { prisma } from "@/utils/prisma";

export const getTasks = async (userId: string) => {
  if (!userId) {
    console.error("userId is required");
    return [];
  }

  try {
    const tasks = await prisma.tasks.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    if (!tasks) return [];
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};
