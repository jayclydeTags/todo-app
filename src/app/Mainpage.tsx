"use client"

import React, { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import { Sun, Sunset, Moon } from "lucide-react"
import type { Task } from '@/types/task'
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"
import { AddEditTaskDialog } from "@/components/add-edit-task-dialog"
import { ViewTaskDialog } from "@/components/view-task-dialog"
import { Card } from "@/components/ui/card"

type TaskFormData = {
  title: string;
  timeOfDay: "morning" | "afternoon" | "evening";
  priority: "Low" | "Medium" | "High";
  notes?: string;
}

function DroppableColumn({ id, title, children }: { id: Task['timeOfDay'], title: string, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  const icons = {
    morning: <Sun className="h-5 w-5 text-yellow-500" />,
    afternoon: <Sunset className="h-5 w-5 text-orange-500" />,
    evening: <Moon className="h-5 w-5 text-blue-500" />,
  };

  // Count the number of child elements (tasks)
  const taskCount = React.Children.count(children);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {icons[id]}
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {taskCount} task{taskCount !== 1 ? 's' : ''}
        </p>
      </div>
      <Card
        ref={setNodeRef}
        className="p-4 min-h-[200px]"
      >
        <div className="space-y-4">
          {children}
        </div>
      </Card>
    </div>
  );
}

const Mainpage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    })
  )

  const completedTasks = tasks.filter((task) => task.completed).length

  const handleAddTask = (formData: TaskFormData) => {
    const task: Task = {
      ...formData,
      id: crypto.randomUUID(),
      completed: false,
    }
    setTasks((prev) => [...prev, task])
  }

  const handleEditTask = (formData: TaskFormData) => {
    if (!selectedTask) return
    const editedTask: Task = {
      ...selectedTask,
      ...formData,
    }
    setTasks((prev) =>
      prev.map((task) => (task.id === editedTask.id ? editedTask : task))
    )
  }

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setIsViewDialogOpen(true)
  }

  const handleEditClick = (task: Task) => {
    setSelectedTask(task)
    setIsEditDialogOpen(true)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeTask = tasks.find((task) => task.id === active.id)
    const overColumn = over.id as Task['timeOfDay']

    if (activeTask && activeTask.timeOfDay !== overColumn) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeTask.id
            ? { ...task, timeOfDay: overColumn }
            : task
        )
      )
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const getTasksByTimeOfDay = (timeOfDay: Task['timeOfDay']) => {
    return tasks.filter((task) => task.timeOfDay === timeOfDay)
  }

  const timeOfDayColumns: { id: Task['timeOfDay']; title: string }[] = [
    { id: 'morning', title: 'Morning' },
    { id: 'afternoon', title: 'Afternoon' },
    { id: 'evening', title: 'Evening' },
  ]

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Tasks</h1>
          <p className="text-muted-foreground">
            {completedTasks} of {tasks.length} completed
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Add Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {timeOfDayColumns.map((column) => (
            <DroppableColumn key={column.id} id={column.id} title={column.title}>
              {getTasksByTimeOfDay(column.id).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onView={handleViewTask}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteTask}
                />
              ))}
            </DroppableColumn>
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-50">
              <TaskCard
                task={tasks.find((task) => task.id === activeId)!}
                onToggleComplete={handleToggleComplete}
                onView={handleViewTask}
                onEdit={handleEditClick}
                onDelete={handleDeleteTask}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddEditTaskDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddTask}
        mode="add"
      />

      <AddEditTaskDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditTask}
        task={selectedTask}
        mode="edit"
      />

      <ViewTaskDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        task={selectedTask}
      />
    </div>
  )
}

export default Mainpage

