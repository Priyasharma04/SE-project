import React from "react";

export default function PaperCard({ paper }) {
  return (
    <div className="bg-white shadow p-4 rounded w-full max-w-xl mx-auto flex justify-between items-center mt-3">
      <div>
        <h3 className="font-semibold">{paper.filename}</h3>
        <p className="text-gray-500 text-sm">{paper.date}</p>
      </div>
      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{paper.status}</span>
    </div>
  );
}
