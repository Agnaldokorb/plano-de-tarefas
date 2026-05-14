"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, SquarePen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditTask as editTaskAction } from "@/actions/edit-task";
import { DatePickerTime } from "@/components/date-time";
import { combineTaskDateTime, toTimeInputValue } from "@/lib/task-date-time";

type EditTaskProps = {
  id: string;
  task: string;
  description: string;
  scheduledAt: Date | null;
  userId: string;
};

const EditTask = ({ id, task, description, scheduledAt, userId }: EditTaskProps) => {
  const [open, setOpen] = useState(false);
  const [taskValue, setTaskValue] = useState(task);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    scheduledAt ? new Date(scheduledAt) : undefined,
  );
  const [scheduledTime, setScheduledTime] = useState(
    toTimeInputValue(scheduledAt),
  );
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    const trimmedTask = taskValue.trim();

    if (!trimmedTask || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await editTaskAction(
        id,
        trimmedTask,
        descriptionValue.trim(),
        userId,
        combineTaskDateTime(scheduledDate, scheduledTime),
      );
      setOpen(false);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setTaskValue(task);
      setDescriptionValue(description);
      setScheduledDate(scheduledAt ? new Date(scheduledAt) : undefined);
      setScheduledTime(toTimeInputValue(scheduledAt));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <SquarePen className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
          <div className="mt-4 flex flex-col gap-2">
            <Input
              placeholder="Digite sua tarefa"
              value={taskValue}
              onChange={(e) => setTaskValue(e.target.value)}
            />
            <Input
              placeholder="Digite a descrição da tarefa"
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
            />
            <DatePickerTime
              date={scheduledDate}
              time={scheduledTime}
              onDateChange={setScheduledDate}
              onTimeChange={setScheduledTime}
            />
            <Button
              variant="default"
              className="cursor-pointer"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save /> {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
