import React from "react";

export default function FileUploader({ file, setFile, onUpload, loading }) {
  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-xl mx-auto space-y-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        onClick={onUpload}
        disabled={loading}
        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow"
      >
        {loading ? "Analyzing..." : "Upload & Analyze PDF"}
      </button>
    </div>
  );
}
