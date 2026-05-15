"use server";

import { upsertUserProfile } from "@/lib/users";
import { createClient } from "@/utils/supabase-server";

type UpdateCurrentUserProfileInput = {
  name: string;
  email: string;
  phone?: string | null;
};

const normalizePhone = (phone?: string | null) => {
  const trimmedPhone = phone?.trim();
  return trimmedPhone ? trimmedPhone : null;
};

export const updateCurrentUserProfile = async ({
  name,
  email,
  phone,
}: UpdateCurrentUserProfileInput) => {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedName || !normalizedEmail) {
    return {
      success: false,
      error: "Nome e email são obrigatórios.",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Usuário não autenticado.",
      };
    }

    const currentEmail = user.email?.toLowerCase() ?? "";
    const currentMetadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const currentPhone =
      typeof currentMetadata.phone === "string" ? currentMetadata.phone : null;

    const shouldUpdateEmail = currentEmail !== normalizedEmail;
    const shouldUpdateMetadata =
      currentMetadata.full_name !== normalizedName ||
      currentMetadata.name !== normalizedName ||
      currentPhone !== normalizedPhone;

    if (shouldUpdateEmail || shouldUpdateMetadata) {
      const { error: updateAuthError } = await supabase.auth.updateUser({
        ...(shouldUpdateEmail ? { email: normalizedEmail } : {}),
        data: {
          ...currentMetadata,
          full_name: normalizedName,
          name: normalizedName,
          phone: normalizedPhone,
        },
      });

      if (updateAuthError) {
        return {
          success: false,
          error: updateAuthError.message,
        };
      }
    }

    await upsertUserProfile({
      id: user.id,
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
    });

    return {
      success: true,
      emailChanged: shouldUpdateEmail,
    };
  } catch (error) {
    console.error("Error updating current user profile:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao atualizar dados do usuário.",
    };
  }
};
