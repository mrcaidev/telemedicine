export default function StatusBadge({ label }: { label: string }) {
    const styleMap: Record<string, string> = {
      "⏳ Not Started": "bg-gray-100 text-gray-700 ring-1 ring-gray-300",
      "🩺 In Progress": "bg-blue-100 text-blue-700 ring-1 ring-blue-300",
      "✅ Finished": "bg-green-100 text-green-700 ring-1 ring-green-300",
      "📅 Rescheduling": "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300",
      "❌ Cancelled": "bg-red-100 text-red-700 ring-1 ring-red-300",
    };
  
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          styleMap[label] || "bg-gray-100 text-gray-700 ring-1 ring-gray-300"
        }`}
      >
        {label}
      </span>
    );
  }  