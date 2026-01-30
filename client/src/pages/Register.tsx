import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Zap, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/register", { name, email, password });
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Registration failed. Try a different email.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary-light dark:bg-primary-dark p-4 rounded-3xl text-[#082107] mb-4 shadow-ultra">
            <Zap size={40} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Join OptiTask
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your productivity with ease
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              "Creating account..."
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </form>

        <p className="text-center mt-8 text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-light dark:text-primary-dark font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
