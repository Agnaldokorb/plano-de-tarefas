import { createClient } from "@/utils/supabase-server";
import { redirect } from "next/navigation";
import { getTasks } from "@/actions/get-tasks-from-db";
import TasksPageClient from "@/components/tasks-page-client";
import { getUserProfileById } from "@/lib/users";

const Dashboard = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não houver usuário, redireciona para login
  if (!user) {
    redirect("/");
  }

  const taskList = (await getTasks(user.id)) ?? [];
  const userProfile = await getUserProfileById(user.id);

  return (
    <TasksPageClient taskList={taskList} user={user} userProfile={userProfile} />
  );
};

export default Dashboard;
