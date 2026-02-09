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
            <div className="w-full flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                SN: {r?.sn === undefined || r?.sn === null ? "—" : r.sn}
              </span>

              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono truncate max-w-[70%]">
                {r._id}
              </span>
            </div>

            {r.reason_image && (
              <img
                src={r.reason_image}
                alt={r.reason || "Reason"}
                className="w-full h-40 rounded-lg object-cover border mb-4 border-gray-200 dark:border-gray-700"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            )}

            <p
              className={`text-gray-700 dark:text-gray-200 mb-4 ${
                (r.reason || "").length > 50 ? "text-justify" : "text-center"
              }`}
            >
              {r.reason}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => onEdit(r)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-400"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(r._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-400"
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
