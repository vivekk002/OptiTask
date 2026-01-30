import { useState, useEffect } from "react";
import api from "../utils/api";
import { TaskCard } from "../components/TaskCard";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  AlertCircle,
  ChevronRight,
  Loader2,
  CheckCircle2,
  CircleDot,
  Trophy,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import toast from "react-hot-toast";
import { TaskModal } from "../components/TaskModal";

export const Dashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/content/content");
      setTasks(response.data.content || []);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (task: any) => {
    try {
      const newStatus = task.status === "Completed" ? "Todo" : "Completed";
      await api.put(`/content/content/${task._id}`, {
        ...task,
        status: newStatus,
      });
      toast.success(
        newStatus === "Completed"
          ? "Task completed! 🎉"
          : "Task moved to Active",
      );
      fetchTasks();
    } catch (err) {
      console.error("Toggle failed", err);
      toast.error("Status update failed");
    }
  };

  const handleCreateTask = async (formData: any) => {
    try {
      await api.post("/content/content", formData);
      toast.success("Successfully created new task!");
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task", err);
      toast.error("Failed to create task");
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Categories
  const pendingList = tasks.filter((t) => t.status !== "Completed").slice(0, 3);
  const highPriorityList = tasks
    .filter((t) => t.priority === "High" && t.status !== "Completed")
    .slice(0, 3);
  const completedList = tasks
    .filter((t) => t.status === "Completed")
    .reverse()
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary-light mb-4" size={40} />
        <p className="text-slate-500 font-medium">
          Preparing your workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight">
            Performance Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Here's how you're progressing with your goals today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/tasks")}
            className="flex items-center gap-2 h-12 px-6 rounded-xl border border-slate-200 dark:border-white/10"
          >
            <LayoutDashboard size={18} />
            View All Tasks
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 h-12 px-6 shadow-premium hover:shadow-ultra transition-all"
          >
            <Plus size={20} />
            Add New Task
          </Button>
        </div>
      </header>

      {/* Completion Indicator */}
      <div className="glass-card p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-center bg-emerald-500/5 dark:bg-primary-dark/5 border-primary-light/10 shadow-ultra">
        <div className="col-span-1 flex flex-col items-center md:items-start">
          <span className="text-sm font-bold uppercase tracking-widest text-primary-light dark:text-primary-dark mb-1">
            Completion Rate
          </span>
          <span className="text-6xl font-black text-slate-800 dark:text-white">
            {completionRate}%
          </span>
        </div>

        <div className="col-span-1 flex justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-200 dark:text-slate-800"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * completionRate) / 100}
                strokeLinecap="round"
                className="text-primary-light dark:text-primary-dark transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2
                className="text-primary-light dark:text-primary-dark"
                size={48}
              />
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Completed
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-white">
              {completedTasks}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-600">
                <CircleDot size={20} />
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Active Tasks
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-white">
              {pendingTasks}
            </span>
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter text-sm">
              <Clock size={18} className="text-amber-500" />
              Pending Tasks
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tasks?status=Pending&priority=All")}
              className="group text-primary-light"
            >
              View All{" "}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
          <div className="space-y-4">
            {pendingList.length > 0 ? (
              pendingList.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                />
              ))
            ) : (
              <div className="glass-card p-6 text-center text-slate-400 text-sm italic">
                All caught up!
              </div>
            )}
          </div>
        </section>

        {/* High Priority Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter text-sm">
              <AlertCircle size={18} className="text-rose-500" />
              Critical Focus
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tasks?status=All&priority=High")}
              className="group text-primary-light"
            >
              View All{" "}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
          <div className="space-y-4">
            {highPriorityList.length > 0 ? (
              highPriorityList.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                />
              ))
            ) : (
              <div className="glass-card p-6 text-center text-slate-400 text-sm italic">
                No critical tasks.
              </div>
            )}
          </div>
        </section>

        {/* Completed Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter text-sm">
              <Trophy size={18} className="text-emerald-500" />
              Hall of Fame
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tasks?status=All&priority=All")}
              className="group text-primary-light"
            >
              View All{" "}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
          <div className="space-y-4">
            {completedList.length > 0 ? (
              completedList.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                />
              ))
            ) : (
              <div className="glass-card p-6 text-center text-slate-400 text-sm italic">
                Finish something special!
              </div>
            )}
          </div>
        </section>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};
