import { useState } from "react";
import { login } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Enter both username and password");

    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", username);
      alert("Login successful!");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-lg rounded w-96 border border-gray-200"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-3 w-full rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
        />
        <button className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition">
          Login
        </button>
      </form>
    </div>
  );
}
