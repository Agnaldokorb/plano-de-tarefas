# Configuração Supabase Auth - Google OAuth

Sistema de autenticação com Supabase implementado. Siga os passos abaixo para configurar o Google OAuth.

## 📋 Passos de Configuração

### 1. Obtendo as Credenciais do Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` (chave) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Configurar Google OAuth no Supabase

1. No painel do Supabase, vá em **Authentication** > **Providers**
2. Procure por **Google** e clique em **Enable**
3. Você será direcionado para criar um OAuth 2.0 Client ID no Google Cloud Console:
   - Vá para [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto ou selecione um existente
   - Vá em **APIs & Services** > **Credentials**
   - Clique em **Create Credentials** > **OAuth client ID**
   - Selecione **Web application**
   - Em **Authorized redirect URIs**, adicione: `https://seu-projeto.supabase.co/auth/v1/callback`
4. Copie o **Client ID** e **Client Secret**
5. Cole-os de volta no painel do Supabase

### 3. Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Preencha:
   ```
   NEXT_PUBLIC_SUPABASE_URL="sua_url_do_supabase"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_chave_anonima"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. Para produção, atualize `NEXT_PUBLIC_APP_URL` com seu domínio

### 4. Iniciar o Servidor

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🔄 Fluxo de Autenticação

1. **Página de Login** (`/`) - Usuários veem a página de login
2. **Click em "Entrar com Google"** - Abre OAuth do Google
3. **Callback** (`/auth/callback`) - Supabase processa a autenticação
4. **Dashboard** (`/dashboard`) - Usuário autenticado acessa as tarefas

## 🚀 Estrutura de Arquivos Criados

```
src/
├── app/
│   ├── page.tsx                  # Página de login
│   ├── dashboard/
│   │   └── page.tsx              # Página protegida com tarefas
│   └── auth/
│       └── callback/
│           └── route.ts          # Callback do OAuth
├── components/
│   ├── login-page.tsx            # Componente de login
│   └── tasks-page-client.tsx     # Atualizado com logout
├── utils/
│   ├── supabase-client.ts        # Cliente para browser
│   └── supabase-server.ts        # Cliente para server
└── middleware.ts                 # Middleware para autenticação

.env.local                         # Variáveis de ambiente
```

## 🔐 Segurança

- As credenciais públicas (`NEXT_PUBLIC_*`) são seguras pois:
  - Não contêm chaves privadas
  - O Supabase usa Row Level Security (RLS) para proteger dados
  - Cada usuário só acessa seus próprios dados

- O logout remove a sessão do browser e redireciona para a página de login

## 📝 Notas

- Certifique-se de que a URL de callback no Google Cloud Console corresponde à do seu projeto Supabase
- Em desenvolvimento: `http://localhost:3000/auth/callback`
- Em produção: `https://seu-dominio.com/auth/callback`
