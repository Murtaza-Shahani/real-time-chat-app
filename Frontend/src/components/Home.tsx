import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center px-6">

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* 🔹 Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Chat Smarter. <br />
            <span className="text-indigo-500">Connect Faster.</span>
          </h1>

          <p className="text-zinc-400 text-lg">
            Real-time messaging with clean UI, fast performance, and zero clutter.
            Built for modern conversations.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition duration-300 shadow-lg hover:shadow-indigo-500/30"
            >
              Get Started →
            </button>

            <button className="px-6 py-3 border border-zinc-700 rounded-xl hover:bg-zinc-800 transition">
              Learn More
            </button>
          </div>

          <p className="text-sm text-zinc-500">
            No spam. No noise. Just conversations.
          </p>
        </div>

        {/* 🔹 Right Visual (Fake Chat UI) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">

          <div className="bg-zinc-800 p-3 rounded-xl w-fit">
            Hey! How are you? 👋
          </div>

          <div className="bg-indigo-600 p-3 rounded-xl w-fit ml-auto">
            I'm good! Working on a chat app 😄
          </div>

          <div className="bg-zinc-800 p-3 rounded-xl w-fit">
            That sounds awesome 🚀
          </div>

          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            typing...
          </div>

        </div>

      </div>

    </div>
  );
}