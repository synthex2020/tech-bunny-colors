import { useState } from "react";
import { useNavigate } from "react-router";
import { SeriesEventCard } from "../../ui/series-events-card";

const testData = [
  {
    id: "event-001",
    createdAt: "2025-04-28T10:00:00Z",
    title: "The Battle of Black Valley",
    date: "2025-06-15",
    importance: "Major Turning Point",
    description:
      "A pivotal battle that determined the fate of the northern territories, involving the key characters from all factions.",
    eventsMedia: [
      "https://www.usatoday.com/gcdn/media/2020/08/30/USATODAY/usatsports/247WallSt.com-247WS-731827-imageforentry5310.jpg?width=660&height=371&fit=crop&format=pjpg&auto=webp",
      "https://www.usatoday.com/gcdn/media/2020/08/30/USATODAY/usatsports/247WallSt.com-247WS-731827-imageforentry4144.jpg?width=660&height=371&fit=crop&format=pjpg&auto=webp",
    ],
  },
];

const IMPORTANCE_BADGE: Record<string, string> = {
  "Major Turning Point": "badge-error",
  "Minor Event": "badge-info",
  "Background Lore": "badge-ghost",
};

const SORT_OPTIONS = [
  { value: "date-asc", label: "Date (oldest first)" },
  { value: "date-desc", label: "Date (newest first)" },
  { value: "title-asc", label: "Title A → Z" },
];

function ImportantEventsTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");
  const [filter, setFilter] = useState("all");

  const importanceLevels = [
    "all",
    ...Array.from(new Set(testData.map((e) => e.importance))),
  ];

  const processed = testData
    .filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || e.importance === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sort === "date-asc")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sort === "date-desc")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">Important Events</h3>
          <div className="badge badge-neutral badge-lg">{testData.length}</div>
        </div>
        <button
          className="btn btn-primary btn-sm gap-2"
          onClick={() => navigate("events/new")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Event
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <label className="input input-bordered input-sm flex items-center gap-2 flex-1 min-w-48">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-50"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        {/* Importance filter */}
        <select
          className="select select-bordered select-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {importanceLevels.map((level) => (
            <option key={level} value={level}>
              {level === "all" ? "All importance levels" : level}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="select select-bordered select-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Importance legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(IMPORTANCE_BADGE).map(([label, cls]) => (
          <span key={label} className={`badge ${cls} badge-sm gap-1`}>
            {label}
          </span>
        ))}
      </div>

      {/* Empty state */}
      {processed.length === 0 && (
        <div className="hero py-16 bg-base-200 rounded-box">
          <div className="hero-content text-center">
            <div>
              <p className="text-4xl mb-3">📅</p>
              <h4 className="text-lg font-semibold">No events found</h4>
              <p className="text-base-content/60 mt-1">
                {search || filter !== "all"
                  ? "Try adjusting your filters."
                  : "Add the first event to get started."}
              </p>
              {(search || filter !== "all") && (
                <button
                  className="btn btn-sm btn-ghost mt-4"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Events list */}
      {processed.length > 0 && (
        <div className="space-y-4">
          {processed.map((seriesEvent, index) => (
            <div key={seriesEvent.id ?? index} className="relative">
              {/* Importance badge overlay */}
              <div className="absolute top-3 right-3 z-10">
                <span
                  className={`badge ${
                    IMPORTANCE_BADGE[seriesEvent.importance] ?? "badge-ghost"
                  } badge-sm`}
                >
                  {seriesEvent.importance}
                </span>
              </div>
              <SeriesEventCard {...seriesEvent} />
            </div>
          ))}
        </div>
      )}

      {/* Results count when filtering */}
      {(search || filter !== "all") && processed.length > 0 && (
        <p className="text-sm text-base-content/50 text-right">
          Showing {processed.length} of {testData.length} events
        </p>
      )}
    </div>
  );
}

export default ImportantEventsTable;