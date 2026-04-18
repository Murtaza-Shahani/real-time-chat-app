import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login, signup } from "../services/auth.service";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
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
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
      <form
        onSubmit={handleSubmit}
        className="w-[380px] bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>

        {/* Name */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-3 p-3 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-700"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-700"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 p-3 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-700"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Button */}
        <button
          className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          disabled={loginMutation.isPending || signupMutation.isPending}
        >
          {loginMutation.isPending || signupMutation.isPending
            ? "Please wait..."
            : isLogin
            ? "Login"
            : "Signup"}
        </button>

        {/* Toggle */}
        <p
          className="text-sm text-gray-400 text-center mt-5 cursor-pointer hover:text-gray-200 transition"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}