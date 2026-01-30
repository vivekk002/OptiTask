import { useState, useEffect } from "react";
import api from "../utils/api";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";
import { Button } from "../components/ui/Button";
import {
  Plus,
  Search,
  Loader2,
  ArrowLeft,
  Filter,
  SortAsc,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export const TasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const statusFilter = searchParams.get("status") || "All";
  const priorityFilter = searchParams.get("priority") || "All";
  const [sortBy, setSortBy] = useState("Newest");

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/content/content");
      setTasks(response.data.content);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateOrUpdate = async (formData: any) => {
    try {
      if (currentTask) {
        await api.put(`/content/content/${currentTask._id}`, formData);
        toast.success("Task updated successfully!");
      } else {
        await api.post("/content/content", formData);
        toast.success("New task created!");
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      console.error("Operation failed", err);
      toast.error("Operation failed. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/content/content/${id}`);
        toast.success("Task deleted");
        fetchTasks();
      } catch (err) {
        console.error("Delete failed", err);
        toast.error("Delete failed");
      }
    }
  };

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

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "Pending")
        matchesStatus = task.status !== "Completed";
      else if (statusFilter !== "All")
        matchesStatus = task.status === statusFilter;

      let matchesPriority = true;
      if (priorityFilter !== "All")
        matchesPriority = task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "Newest")
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      if (sortBy === "Oldest")
        return (
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
        );
      if (sortBy === "A-Z") return a.title.localeCompare(b.title);
      if (sortBy === "Priority") {
        const pMap: any = { High: 3, Medium: 2, Low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      return 0;
    });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-500 hover:text-primary-light transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            My Tasks
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"} found
          </p>
        </div>
        <Button
          onClick={() => {
            setCurrentTask(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 h-12"
        >
          <Plus size={20} />
          Create Task
        </Button>
      </header>

      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center">
        <div className="flex-1">
          <div className="relative group">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-light transition-colors"
              size={22}
            />
            <input
              type="text"
              placeholder="Search your tasks..."
              className="input-field pl-14 h-14 text-lg shadow-premium focus:shadow-ultra !rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto">
          <div className="relative">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <select
              value={statusFilter}
              onChange={(e) =>
                navigate(
                  `/tasks?status=${e.target.value}&priority=${priorityFilter}`,
                )
              }
              className="input-field pl-11 h-14 cursor-pointer appearance-none shadow-premium focus:shadow-ultra dark:bg-[#162415] !rounded-full font-semibold text-sm"
            >
              <option value="All">All Status</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <select
              value={priorityFilter}
              onChange={(e) =>
                navigate(
                  `/tasks?status=${statusFilter}&priority=${e.target.value}`,
                )
              }
              className="input-field pl-11 h-14 cursor-pointer appearance-none shadow-premium focus:shadow-ultra dark:bg-[#162415] !rounded-full font-semibold text-sm"
            >
              <option value="All">All Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <ChevronDown
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>

          <div className="relative">
            <SortAsc
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field pl-11 h-14 cursor-pointer appearance-none shadow-premium focus:shadow-ultra dark:bg-[#162415] !rounded-full font-semibold text-sm"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="A-Z">A - Z</option>
              <option value="Priority">Priority (H-L)</option>
            </select>
            <ChevronDown
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary-light mb-4" size={40} />
          <p className="text-slate-500">Loading tasks...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in items-stretch">
          {filteredTasks.map((task) => (
            <div key={task._id} className="flex flex-col h-full">
              <TaskCard
                task={task}
                onEdit={(t) => {
                  setCurrentTask(t);
                  setIsModalOpen(true);
                }}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card">
          <p className="text-slate-500">No tasks found here.</p>
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={currentTask}
      />
    </div>
  );
};
