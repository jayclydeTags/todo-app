import React from 'react'
import type { Task } from "@/types/task"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ViewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function ViewTaskDialog({ open, onOpenChange, task }: ViewTaskDialogProps): React.ReactElement | null {
  if (!task) return null

  const priorityColors: Record<Task['priority'], string> = {
    Low: "bg-green-500/10 text-green-500",
    Medium: "bg-yellow-500/10 text-yellow-500",
    High: "bg-red-500/10 text-red-500",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Title</h3>
            <p>{task.title}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Time of Day</h3>
            <p className="capitalize">{task.timeOfDay}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Priority</h3>
            <Badge variant="secondary" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Status</h3>
            <Badge variant="secondary">{task.completed ? "Completed" : "Pending"}</Badge>
          </div>
          {task.notes && (
            <div>
              <h3 className="font-semibold mb-1">Notes</h3>
              <p className="text-muted-foreground">{task.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 