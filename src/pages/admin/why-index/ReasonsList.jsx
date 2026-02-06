"use client";

export default function ReasonsList({ reasons = [], onEdit, onDelete }) {
  return (
    <div className="grid md:grid-cols-2 xxl:grid-cols-3 gap-6">
      {reasons.length > 0 ? (
        reasons.map((r) => (
          <div
            key={r._id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 flex flex-col items-center text-center transition-colors duration-300"
          >
            {r.reason_image && (
              <img
                src={process.env.NEXT_PUBLIC_BACKEND_URL + r.reason_image}
                alt={r.reason || "Reason"}
                className="w-full h-40 rounded-lg object-cover border mb-4 border-gray-200 dark:border-gray-700"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            )}
            <p
              className={`text-gray-700 dark:text-gray-200 mb-4 ${
                r.reason.length > 50 ? "text-justify" : "text-center"
              }`}
            >
              {r.reason}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(r)}
                aria-label={`Edit reason: ${r.reason}`}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-400 transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(r._id)}
                aria-label={`Delete reason: ${r.reason}`}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-400 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
          No reasons found.
        </p>
      )}
    </div>
  );
}
