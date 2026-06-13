import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login, signup } from "../services/auth.service";
import { setAccessToken } from "../services/auth";
import { useNavigate } from "react-router-dom";
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // localStorage.setItem("token", data.access_token);
      // localStorage.setItem("user", JSON.stringify(data.user));
      setAccessToken(data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Login successful, token stored:", data.access_token);
      navigate("/");
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      alert("Signup successful! Now login.");
      setIsLogin(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      loginMutation.mutate({
        email: form.email,
        password: form.password,
      });
    } else {
      signupMutation.mutate(form);
    }
  };

  return (
    <div className="min-h-screen bg-black grid lg:grid-cols-2 text-white">

      {/* ================= LEFT SIDE ================= */}
      <div className="hidden lg:flex relative overflow-hidden">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
          alt="workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-14">

          {/* Top Logo */}
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              ByteTalk<span className="text-indigo-500">Talk</span>
            </h1>
          </div>

          {/* Center Minimal Content */}
          <div className="max-w-md">
            <p className="text-indigo-400 text-sm uppercase tracking-[4px] mb-4">
              Modern Messaging
            </p>

            <h2 className="text-2xl font-bold leading-tight mb-6">
              Conversations,
              <br />
              without distractions.
            </h2>

            <p className="text-zinc-400 text-md leading-relaxed">
              Simple. Fast. Clean experience built for modern communication.
            </p>
          </div>

          {/* Bottom Minimal Cards */}
          <div className="flex gap-4 mb-5">

            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-5 py-4">
              <h3 className="text-2xl font-semibold">100%</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Real-time sync
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-5 py-4">
              <h3 className="text-2xl font-semibold">Secure</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Private messaging
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center justify-center px-6 py-10 bg-gradient-to-b from-black via-zinc-950 to-black">

        <div className="w-full max-w-md">

          {/* Mobile Heading */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">
              Byte<span className="text-indigo-500">Talk</span>
            </h1>

            <p className="text-zinc-400">
              Real-time conversations made simple.
            </p>
          </div>

          {/* Auth Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl rounded-2xl p-8 shadow-5xl"
          >

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold mb-2">
                {isLogin ? "Welcome Back 👋" : "Create Account"}
              </h2>

              <p className="text-zinc-400">
                {isLogin
                  ? "Login to continue your conversations."
                  : "Signup and start chatting instantly."}
              </p>
            </div>

            {/* Name */}
            {!isLogin && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-4 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={
                loginMutation.isPending || signupMutation.isPending
              }
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition duration-300 shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50"
            >
              {loginMutation.isPending || signupMutation.isPending
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>

            {/* Toggle */}
            <p
              className="text-center text-zinc-400 mt-8 cursor-pointer hover:text-white transition"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Signup"
                : "Already have an account? Login"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}