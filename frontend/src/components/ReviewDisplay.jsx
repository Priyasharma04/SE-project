export default function ReviewDisplay({ review }) {
  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <h2 className="font-bold text-lg mb-2">Summary</h2>
      <p>{review.summary}</p>

      <h2 className="font-bold text-lg mt-2">Strengths</h2>
      <ul>
        {review.strengths.map((s, i) => (
          <li key={i}>• {s}</li>
        ))}
      </ul>

      <h2 className="font-bold text-lg mt-2">Weaknesses</h2>
      <ul>
        {review.weaknesses.map((w, i) => (
          <li key={i}>• {w}</li>
        ))}
      </ul>

      <h2 className="font-bold text-lg mt-2">Suggestions</h2>
      <ul>
        {review.suggestions.map((s, i) => (
          <li key={i}>• {s}</li>
        ))}
      </ul>

      <h2 className="font-bold text-lg mt-2">Decision</h2>
      <p>{review.decision}</p>
    </div>
  );
}
