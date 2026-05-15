import { prisma } from "@/utils/prisma";

type UpsertUserProfileInput = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

const normalizeName = (name: string) => {
  return name.trim();
};

const normalizePhone = (phone?: string | null) => {
  const trimmedPhone = phone?.trim();
  return trimmedPhone ? trimmedPhone : null;
};

export const upsertUserProfile = async ({
  id,
  name,
  email,
  phone,
}: UpsertUserProfileInput) => {
  const normalizedName = normalizeName(name);
  const normalizedEmail = email.trim().toLowerCase();

  if (!id || !normalizedName || !normalizedEmail) {
    throw new Error("ID, nome e email do usuário são obrigatórios");
  }

  return prisma.user.upsert({
    where: { id },
    update: {
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizePhone(phone),
    },
    create: {
      id,
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizePhone(phone),
    },
  });
};

export const getUserProfileById = async (
  id: string,
): Promise<UserProfile | null> => {
  if (!id) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
};
