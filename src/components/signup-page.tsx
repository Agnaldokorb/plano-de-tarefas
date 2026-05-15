"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import { upsertUser } from "@/actions/upsert-user";

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPhone ||
      !password ||
      !confirmPassword
    ) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            name: trimmedName,
            phone: trimmedPhone,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!data.user?.id) {
        setError("Não foi possível obter o ID do usuário criado");
        return;
      }

      const userResult = await upsertUser({
        id: data.user.id,
        name: trimmedName,
        email: data.user.email || trimmedEmail,
        phone: trimmedPhone,
      });

      if (!userResult.success) {
        setError(userResult.error ?? "Erro ao salvar usuário no banco");
        return;
      }

      // Redireciona para login após cadastro
      router.push(
        "/?tab=email&message=Cadastro realizado! Faça login com suas credenciais.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full h-screen bg-linear-to-br from-blue-500 to-blue-700 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-3xl font-bold text-blue-600">
            Criar Conta
          </CardTitle>
          <p className="text-gray-600 text-center mt-2">
            Cadastre-se para começar a organizar suas tarefas
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <Input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Telefone
              </label>
              <Input
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Cadastrando..." : "Criar Conta"}
            </Button>
          </form>

          <Separator />

          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar ao Login
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Ao cadastrar, você concorda com nossos termos de serviço e política
            de privacidade.
          </p>
        </CardContent>
      </Card>

      <footer className="absolute bottom-4 text-white text-sm">
        <p>
          &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> - Desenvolvido por{" "}
          <a
            href="mailto:agnaldokorb@gmail.com"
            className="underline hover:no-underline"
          >
            Agnaldo Korb
          </a>
        </p>
      </footer>
    </main>
  );
};

export default SignupPage;
