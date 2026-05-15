"use server";

import { upsertUserProfile } from "@/lib/users";

type UpsertUserInput = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
};

export const upsertUser = async (input: UpsertUserInput) => {
  try {
    await upsertUserProfile(input);
    return { success: true };
  } catch (error) {
    console.error("Error saving user:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao salvar usuário no banco de dados",
    };
  }
};
