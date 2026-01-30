import { Edit3, Trash2, Calendar, Clock, CheckCircle2 } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onToggleComplete?: (task: Task) => void;
}

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskCardProps) => {
  const priorityColors: Record<string, string> = {
    High: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    Medium:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    Low: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  const statusColors: Record<string, string> = {
    Completed: "border-l-emerald-500",
    "In Progress": "border-l-primary-light",
    Todo: "border-l-slate-400 dark:border-l-emerald-900",
  };

  const dateObj = task.createdAt ? new Date(task.createdAt) : null;
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const formattedTime = dateObj
    ? dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`glass-card p-6 border-l-[6px] ${statusColors[task.status] || "border-l-slate-300"} hover:-translate-y-1.5 hover:shadow-ultra transition-all duration-300 group flex flex-col h-full`}
    >
      <div className="flex justify-between items-start mb-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${priorityColors[task.priority] || "bg-slate-100 text-slate-600"}`}
        >
          {task.priority}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          {onToggleComplete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task);
              }}
              className={`p-1.5 rounded-lg transition-colors ${task.status === "Completed" ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              title={
                task.status === "Completed"
                  ? "Mark as Active"
                  : "Mark as Completed"
              }
            >
              <CheckCircle2 size={16} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <Edit3 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <h3
        className={`text-lg font-semibold mb-2 leading-tight transition-colors ${task.status === "Completed" ? "text-slate-400 line-through" : "text-slate-800 dark:text-white"}`}
      >
        {task.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <div
              className={`w-2 h-2 rounded-full ${task.status === "Completed" ? "bg-emerald-500" : task.status === "In Progress" ? "bg-primary-light" : "bg-slate-400"}`}
            />
            {task.status}
          </div>

          {formattedDate && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <Calendar size={12} />
                {formattedDate}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <Clock size={12} />
                {formattedTime}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
