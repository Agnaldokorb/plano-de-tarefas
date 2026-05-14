"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  ListCheck,
  Scroll,
  CheckCheck,
  ListChecks,
  View,
  CalendarClock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditTask from "@/components/edit-task";
import DelitTask from "@/components/delit-task";
import ViewTask from "@/components/view-task";
import ClearTasks from "@/components/clear-tasks";
import UserHeader from "@/components/user-header";
import { NewTask } from "@/actions/add-task";
import { toggleTaskDone } from "@/actions/toggle-task-done";
import { DatePickerTime } from "./date-time";
import { combineTaskDateTime, formatTaskDateTime } from "@/lib/task-date-time";

type Task = {
  id: string;
  task: string;
  description: string;
  done: boolean;
  scheduledAt: Date | null;
  createdAt: Date;
};

type TasksPageClientProps = {
  taskList: Task[];
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
};

type FilterType = "todas" | "nao-concluidas" | "concluidas";

const TasksPageClient = ({ taskList, user }: TasksPageClientProps) => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("todas");
  const router = useRouter();

  const filteredTaskList = taskList.filter((item) => {
    if (filterType === "concluidas") return item.done;
    if (filterType === "nao-concluidas") return !item.done;
    return true;
  });

  const totalTasks = taskList.length;
  const completedTasks = taskList.filter((item) => item.done).length;
  const completionPercentage =
    totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  const handleCreateTask = async () => {
    const trimmedTask = task.trim();

    if (!trimmedTask || isCreating || !user?.id) {
      return;
    }

    setIsCreating(true);

    try {
      await NewTask(
        trimmedTask,
        description.trim(),
        user.id,
        combineTaskDateTime(scheduledDate, scheduledTime),
      );
      setTask("");
      setDescription("");
      setScheduledDate(undefined);
      setScheduledTime("");
      router.refresh();
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleDone = async (taskId: string, done: boolean) => {
    if (isTogglingId || !user?.id) {
      return;
    }

    setIsTogglingId(taskId);

    try {
      const success = await toggleTaskDone(taskId, done, user.id);

      if (success) {
        router.refresh();
      }
    } finally {
      setIsTogglingId(null);
    }
  };

  return (
    <main className="w-full h-screen bg-gray-100 flex flex-col">
      <UserHeader user={user} />

      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle className="text-2xl font-bold text-blue-500">
              Plano de tarefas
            </CardTitle>
            <Input
              placeholder="Digite sua tarefa"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <Input
              placeholder="Digite a descrição da tarefa"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <DatePickerTime
              date={scheduledDate}
              time={scheduledTime}
              onDateChange={setScheduledDate}
              onTimeChange={setScheduledTime}
            />
            <Button
              variant="default"
              className="cursor-pointer w-full"
              onClick={handleCreateTask}
              disabled={isCreating}
            >
              <Plus /> {isCreating ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </CardHeader>

          <CardContent>
            <Separator />
            <div className="mt-4 flex gap-2 justify-center">
              <Badge
                variant={filterType === "todas" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterType("todas")}
              >
                <ListCheck /> Todas
              </Badge>
              <Badge
                variant={
                  filterType === "nao-concluidas" ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => setFilterType("nao-concluidas")}
              >
                <Scroll /> Não concluidas
              </Badge>
              <Badge
                variant={filterType === "concluidas" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterType("concluidas")}
              >
                <CheckCheck /> Concluidas
              </Badge>
            </div>
            {filteredTaskList.map((item) => (
              <div className="mt-4 border-b-2" key={item.id}>
                <div
                  className="min-h-12 flex items-stretch justify-between border-t-2 cursor-pointer"
                  onClick={() => handleToggleDone(item.id, item.done)}
                  role="button"
                  aria-pressed={item.done}
                >
                  <div
                    className={`w-1 self-stretch ${item.done ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <div className="flex-1 px-2 py-1">
                    <p
                      className={
                        item.done ? "line-through text-gray-500" : "text-black"
                      }
                    >
                      {item.task}
                    </p>
                    {item.scheduledAt && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                        <CalendarClock className="size-3.5" />
                        {formatTaskDateTime(item.scheduledAt)}
                      </p>
                    )}
                  </div>
                  <div
                    className="flex items-center gap-3 pr-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ViewTask
                      id={item.id}
                      task={item.task}
                      description={item.description}
                      done={item.done}
                      scheduledAt={item.scheduledAt}
                      createdAt={item.createdAt}
                    />
                    <EditTask
                      id={item.id}
                      task={item.task}
                      description={item.description}
                      scheduledAt={item.scheduledAt}
                      userId={user?.id || ""}
                    />
                    <DelitTask
                      id={item.id}
                      task={item.task}
                      userId={user?.id || ""}
                    />
                  </div>
                </div>
                {isTogglingId === item.id && (
                  <p className="text-xs text-gray-500 mt-1">
                    Atualizando status...
                  </p>
                )}
              </div>
            ))}
          </CardContent>

          <div className="p-4">
            <Separator className="mb-4" />
            <div className="flex justify-between items-center w-full">
              <p className="flex items-center gap-2">
                <ListChecks />
                tarefas concluídas ({completedTasks}/{totalTasks})
              </p>
              <ClearTasks
                completedCount={completedTasks}
                userId={user?.id || ""}
              />
            </div>

            <div className="h-3 w-full bg-gray-200 mt-4 rounded-2xl">
              <div
                className="h-full bg-green-400 rounded-2xl"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-end items-center mt-4">
              <p className="flex items-center gap-2">
                <View />
                {totalTasks} tarefas no total
              </p>
            </div>
          </div>
        </Card>
      </div>

      <footer className="text-center pb-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} - Desenvolvido por{" "}
          <a href="https://w.app/r51ogj" target="_blank" className="text-blue-500">
            Agnaldo Korb
          </a>
        </p>
      </footer>
    </main>
  );
};

export default TasksPageClient;
