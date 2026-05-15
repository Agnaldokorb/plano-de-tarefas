import { createClient } from "@/utils/supabase-server";
import { upsertUserProfile } from "@/lib/users";
import { NextResponse } from "next/server";

const getPhoneFromMetadata = (metadata: Record<string, unknown> | null) => {
  const phone = metadata?.phone;
  return typeof phone === "string" ? phone : null;
};

const getNameFromMetadata = (
  metadata: Record<string, unknown> | null,
  email: string,
) => {
  const fullName = metadata?.full_name;
  const name = metadata?.name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName;
  }

  if (typeof name === "string" && name.trim()) {
    return name;
  }

  return email.split("@")[0] || "Usuário";
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      try {
        await upsertUserProfile({
          id: user.id,
          name: getNameFromMetadata(user.user_metadata, user.email),
          email: user.email,
          phone: getPhoneFromMetadata(user.user_metadata),
        });
      } catch (error) {
        console.error("Error syncing auth user:", error);
      }
    }
  }

  // Redireciona para o dashboard após o login
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
