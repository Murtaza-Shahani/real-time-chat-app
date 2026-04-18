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

  // ✅ LOGIN
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/"; // redirect to chat
    },
  });

  // ✅ SIGNUP
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
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-96 shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? "Login" : "Signup"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            className="w-full mb-3 p-3 border rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          className="text-sm text-center mt-4 cursor-pointer text-blue-600"
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