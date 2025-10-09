import { useState } from "react";
import { signup } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return alert("Please fill all fields");
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be 8+ chars, include at least 1 uppercase and 1 number.");
      return;
    }

    try {
      await signup(username, email, password);
      alert("Signup successful! Please login now.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed. Try another username.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-lg rounded w-96 border border-gray-200"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Create Account</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-3 w-full rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-3 w-full rounded"
        />
        <input
          type="password"
          placeholder="Password (8+ chars, 1 uppercase, 1 number)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
        />
        <button className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}
