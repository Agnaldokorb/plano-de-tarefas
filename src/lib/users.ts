import { prisma } from "@/utils/prisma";

type UpsertUserProfileInput = {
  id: string;
  email: string;
  phone?: string | null;
};

const normalizePhone = (phone?: string | null) => {
  const trimmedPhone = phone?.trim();
  return trimmedPhone ? trimmedPhone : null;
};

export const upsertUserProfile = async ({
  id,
  email,
  phone,
}: UpsertUserProfileInput) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!id || !normalizedEmail) {
    throw new Error("ID e email do usuário são obrigatórios");
  }

  return prisma.user.upsert({
    where: { id },
    update: {
      email: normalizedEmail,
      phone: normalizePhone(phone),
    },
    create: {
      id,
      email: normalizedEmail,
      phone: normalizePhone(phone),
    },
  });
};
