import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ChatPage from './features/chat/ChatPage';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">

        {/* ✅ Navbar always visible (but content changes based on login) */}
        <Navbar />

        {/* ✅ Main Content */}
        <div className="flex-1 overflow-hidden">
          <Routes>

            {/* 🔓 Public Route */}
            <Route
              path="/auth"
              element={!token ? <AuthPage /> : <Navigate to="/" />}
            />

            {/* 🔐 Private Route */}
            <Route
              path="/"
              element={token ? <ChatPage /> : <Navigate to="/auth" />}
            />

          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;