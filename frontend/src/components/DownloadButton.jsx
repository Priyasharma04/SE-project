import React from "react";
import jsPDF from "jspdf";

export default function DownloadButton({ review }) {
  const handleDownload = () => {
    if (!review) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("AI Research Paper Review", 10, 10);
    doc.setFontSize(11);
    doc.text(review, 10, 20, { maxWidth: 180 });
    doc.save("Decision_Memo.pdf");
  };
  return (
    <button
      onClick={handleDownload}
      className="mt-4 w-full max-w-xl mx-auto py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow"
    >
      Download Decision Memo (PDF)
    </button>
  );
}
