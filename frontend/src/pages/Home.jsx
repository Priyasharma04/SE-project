import { useState } from "react";
import { uploadPDF } from "../utils/api";
import ReviewDisplay from "../components/ReviewDisplay";
import Header from "../components/Header";
export default function Home() {
  const [file, setFile] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF first");
    setLoading(true);
    try {
      const data = await uploadPDF(file, token);
      setReview(data);
    } catch (err) {
      alert("Upload failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 font-sans">
      <Header />
      <main className="flex flex-col items-center justify-start mt-12 px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg">
          <h2 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
            Upload Your Research Paper
          </h2>

          <div className="flex flex-col items-center gap-6">
            <label className="w-full">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full rounded-xl bg-purple-50 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
              />
            </label>
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:to-indigo-600 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Upload & Review"}
            </button>
          </div>
        </div>
        {review && (
          <div className="mt-12 w-full max-w-3xl">
            <ReviewDisplay review={review} />
          </div>
        )}
      </main>
    </div>
  );
}
