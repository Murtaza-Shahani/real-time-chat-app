export default function Navbar() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="font-semibold text-lg">Chat App</h1>

      {token ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => (window.location.href = "/auth")}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Login / Signup
        </button>
      )}
    </div>
  );
}