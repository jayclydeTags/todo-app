import React from 'react'
import { Edit, Trash2, GripVertical } from "lucide-react"
import { useDraggable } from '@dnd-kit/core'
import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ 
  task, 
  onToggleComplete, 
  onView, 
  onEdit, 
  onDelete,
}: TaskCardProps): React.ReactElement {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: task,
  })

  const priorityColors: Record<Task['priority'], string> = {
    Low: "bg-green-500/10 text-green-500",
    Medium: "bg-yellow-500/10 text-yellow-500",
    High: "bg-red-500/10 text-red-500",
  }

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click event if clicking on buttons, checkbox, or drag handle
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest('button') || e.target.closest('label') || e.target.closest('[data-drag-handle]'))
    ) {
      return
    }
    onView(task)
  }

  return (
    <Card 
      ref={setNodeRef}
      className={`mb-4 cursor-pointer hover:bg-accent/50 transition-colors group relative ${
        isDragging ? 'opacity-50' : ''
      }`} 
      onClick={handleClick}
    >
      <CardHeader className="p-4 flex flex-row items-center space-y-0 justify-between">
        <div className="flex items-center space-x-2">
          <div 
            {...attributes}
            {...listeners}
            data-drag-handle 
            className="cursor-grab active:cursor-grabbing p-1 -ml-2 opacity-0 group-hover:opacity-100 transition-opacity touch-none"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} />
          <Badge variant="secondary" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>
        <CardTitle className={`${task.completed ? "line-through text-muted-foreground" : ""} text-base font-medium`}>
          {task.title}
        </CardTitle>
        
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(task.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      {task.notes && (
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{task.notes}</p>
        </CardContent>
      )}
    </Card>
  )
} 