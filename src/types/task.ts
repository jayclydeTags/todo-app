export interface Task {
  id: string;
  title: string;
  timeOfDay: "morning" | "afternoon" | "evening";
  priority: "Low" | "Medium" | "High";
  notes?: string;
  completed: boolean;
} 