import { useEffect, useState } from "react";
import { getHistory } from "../utils/api";
import Header from "../components/Header";

export default function Profile() {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getHistory(token).then((data) => setHistory(data.uploaded_files || []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Uploaded Papers</h1>
        {history.length === 0 ? (
          <p className="text-gray-500">No uploaded papers yet.</p>
        ) : (
          <div className="grid gap-4">
            {history.map((f, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-800">{f}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
