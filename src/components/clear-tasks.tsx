"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { clearCompletedTasks } from "@/actions/clear-tasks";

type ClearTasksProps = {
  completedCount: number;
  userId: string;
};

const ClearTasks = ({ completedCount, userId }: ClearTasksProps) => {
  const [open, setOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const handleClearCompleted = async () => {
    if (isClearing || completedCount === 0) {
      return;
    }

    setIsClearing(true);

    try {
      const result = await clearCompletedTasks(userId);

      if (result.success) {
        setOpen(false);
        router.refresh();
      }
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={completedCount === 0}
        >
          <Trash />
          Limpar tarefas concluidas
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem Certeza que deseja excluir {completedCount} tarefas concluidas?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente suas
            tarefas concluídas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleClearCompleted}
            disabled={isClearing || completedCount === 0}
          >
            {isClearing ? "Limpando..." : "Continuar"}
          </AlertDialogAction>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearTasks;