"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatTaskDateTime } from "@/lib/task-date-time";

type ViewTaskProps = {
  id: string;
  task: string;
  description: string;
  done: boolean;
  scheduledAt: Date | null;
  createdAt: Date;
};

const ViewTask = ({
  id,
  task,
  description,
  done,
  scheduledAt,
  createdAt,
}: ViewTaskProps) => {
  const [open, setOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer w-5 h-5 text-blue-500 hover:text-blue-700" />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Detalhes da Tarefa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Tarefa
            </label>
            <p
              className={`text-base mt-1 ${
                done ? "line-through text-gray-500" : "text-black"
              }`}
            >
              {task}
            </p>
          </div>

          <Separator />

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Descrição
            </label>
            <p className="text-base mt-1 text-gray-700">
              {description || "Sem descrição"}
            </p>
          </div>

          <Separator />

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Data e hora
            </label>
            <p className="mt-1 flex items-center gap-2 text-base text-gray-700">
              <CalendarClock className="size-4 text-gray-500" />
              <span suppressHydrationWarning>{formatTaskDateTime(scheduledAt)}</span>
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Status
              </label>
              <p
                className={`text-base mt-1 font-semibold ${
                  done ? "text-green-600" : "text-red-600"
                }`}
              >
                {done ? "Concluída" : "Não concluída"}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">
                ID
              </label>
              <p className="text-xs mt-1 text-gray-500 break-all">{id}</p>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Criada em
            </label>
            <p className="text-base mt-1 text-gray-700">
              <span suppressHydrationWarning>{formatDate(createdAt)}</span>
            </p>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTask;
