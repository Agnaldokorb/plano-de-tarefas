import { createClient } from "@/utils/supabase-server";
import { upsertUserProfile } from "@/lib/users";
import { NextResponse } from "next/server";

const getPhoneFromMetadata = (metadata: Record<string, unknown> | null) => {
  const phone = metadata?.phone;
  return typeof phone === "string" ? phone : null;
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
