"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerTimeProps = {
  date?: Date
  time: string
  onDateChange: (date: Date | undefined) => void
  onTimeChange: (time: string) => void
  className?: string
}

export function DatePickerTime({
  date,
  time,
  onDateChange,
  onTimeChange,
  className,
}: DatePickerTimeProps) {
  const [open, setOpen] = React.useState(false)
  const datePickerId = React.useId()
  const timePickerId = React.useId()
  const hasValue = Boolean(date || time)

  return (
    <FieldGroup className={cn("flex-row items-end gap-3", className)}>
      <Field>
        <FieldLabel htmlFor={datePickerId}>Data</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              id={datePickerId}
              className="w-full justify-between font-normal"
            >
              {date ? format(date, "dd/MM/yyyy") : "Selecionar data"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              onSelect={(date) => {
                onDateChange(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32">
        <FieldLabel htmlFor={timePickerId}>Hora</FieldLabel>
        <Input
          type="time"
          id={timePickerId}
          step="60"
          value={time}
          onChange={(event) => onTimeChange(event.target.value)}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
      {hasValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Limpar data e hora"
          title="Limpar data e hora"
          onClick={() => {
            onDateChange(undefined)
            onTimeChange("")
          }}
        >
          <XIcon />
        </Button>
      )}
    </FieldGroup>
  )
}
