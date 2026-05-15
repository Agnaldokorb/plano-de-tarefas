"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase-client";
import { Loader2, LogOut, Save } from "lucide-react";
import { updateCurrentUserProfile } from "@/actions/update-current-user-profile";

type UserHeaderProps = {
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  userProfile?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
};

const UserHeader = ({ user, userProfile }: UserHeaderProps) => {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formInfo, setFormInfo] = useState<string | null>(null);

  const initialName = useMemo(() => {
    if (userProfile?.name) {
      return userProfile.name;
    }

    return user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
  }, [userProfile?.name, user?.email, user?.user_metadata?.full_name]);

  const initialEmail = useMemo(() => {
    return userProfile?.email || user?.email || "";
  }, [userProfile?.email, user?.email]);

  const initialPhone = useMemo(() => {
    return userProfile?.phone || "";
  }, [userProfile?.phone]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setName(initialName);
      setEmail(initialEmail);
      setPhone(initialPhone);
      setFormError(null);
      setFormInfo(null);
    }
  };

  const handleSaveProfile = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    if (!user?.id || !trimmedName || !trimmedEmail || isSaving) {
      setFormError("Nome e email são obrigatórios.");
      return;
    }

    setIsSaving(true);
    setFormError(null);
    setFormInfo(null);

    try {
      const result = await updateCurrentUserProfile({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone ? trimmedPhone : null,
      });

      if (!result.success) {
        setFormError(result.error ?? "Erro ao atualizar perfil.");
        return;
      }

      if (result.emailChanged) {
        setFormInfo("Email atualizado. Verifique sua caixa de entrada para confirmar o novo endereço.");
      }

      setOpen(false);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  const userName = initialName || "Usuário";
  const userEmail = initialEmail;
  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full font-semibold text-sm">
            {initials}
          </div>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <button type="button" className="flex flex-col text-left cursor-pointer">
                <p className="font-semibold text-gray-800 text-sm hover:text-blue-600 transition-colors">
                  {userName}
                </p>
                {userEmail && <p className="text-xs text-gray-500">{userEmail}</p>}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar dados do usuário</DialogTitle>
              </DialogHeader>

              <div className="mt-2 flex flex-col gap-3">
                <Input
                  placeholder="Nome"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isSaving}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSaving}
                />
                <Input
                  placeholder="Telefone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  disabled={isSaving}
                />

                {formError && (
                  <p className="text-sm text-red-600" role="alert">
                    {formError}
                  </p>
                )}

                {formInfo && (
                  <p className="text-sm text-blue-600" role="status">
                    {formInfo}
                  </p>
                )}

                <Button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar dados
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
