import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface Task {
  _id?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  initialData?: Task | null;
}

export const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TaskModalProps) => {
  const [formData, setFormData] = useState<Task>({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Todo",
        priority: "Medium",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0f1115] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {initialData ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          >
            <X
              size={20}
              className="text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white transition-colors"
            />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Task Title
            </label>
            <Input
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Description
            </label>
            <textarea
              className="input-field min-h-[120px] resize-none py-3"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Status
              </label>
              <select
                className="input-field cursor-pointer accent-primary-light"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Todo" className="dark:bg-slate-900">
                  Todo
                </option>
                <option value="In Progress" className="dark:bg-slate-900">
                  In Progress
                </option>
                <option value="Completed" className="dark:bg-slate-900">
                  Completed
                </option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Priority
              </label>
              <select
                className="input-field cursor-pointer accent-primary-light"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="Low" className="dark:bg-slate-900">
                  Low
                </option>
                <option value="Medium" className="dark:bg-slate-900">
                  Medium
                </option>
                <option value="High" className="dark:bg-slate-900">
                  High
                </option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-white/5">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="px-8 h-11">
              {initialData ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
