import { useState } from "react";
import { useNavigate } from "react-router";
import { SeriesLocationCard } from "../../ui/series-location-card";

const testData = [
  {
    id: "location-001",
    createdAt: "2025-04-27T14:30:00Z",
    title: "Black Valley",
    type: "Battlefield",
    geoLocation: "45.4215,-75.6992",
    description:
      "A desolate valley surrounded by jagged mountains, infamous for the legendary battle that took place there.",
    locationMedia: [
      "https://media.nomadicmatt.com/2023/historyangkor.jpeg",
      "https://media.nomadicmatt.com/2023/historygiza.jpeg",
    ],
  },
];

const TYPE_BADGE: Record<string, string> = {
  Battlefield: "badge-error",
  City: "badge-info",
  Village: "badge-success",
  Dungeon: "badge-warning",
  Wilderness: "badge-ghost",
};

const SORT_OPTIONS = [
  { value: "title-asc", label: "Title A → Z" },
  { value: "title-desc", label: "Title Z → A" },
  { value: "newest", label: "Newest added" },
  { value: "oldest", label: "Oldest added" },
];

function LocationsTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title-asc");
  const [typeFilter, setTypeFilter] = useState("all");

  const locationTypes = [
    "all",
    ...Array.from(new Set(testData.map((l) => l.type))),
  ];

  const processed = testData
    .filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase()) ||
        l.type.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || l.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      if (sort === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sort === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      return 0;
    });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">Locations</h3>
          <div className="badge badge-neutral badge-lg">{testData.length}</div>
        </div>
        <button
          className="btn btn-primary btn-sm gap-2"
          onClick={() => navigate("locations/new")}
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
          Add Location
        </button>
      </div>

      {/* Stats strip */}
      <div className="stats stats-horizontal bg-base-200 w-full shadow-none border border-base-300 rounded-box">
        <div className="stat px-4 py-3">
          <div className="stat-title text-xs">Total</div>
          <div className="stat-value text-lg">{testData.length}</div>
        </div>
        {locationTypes
          .filter((t) => t !== "all")
          .map((type) => (
            <div key={type} className="stat px-4 py-3">
              <div className="stat-title text-xs">{type}</div>
              <div className="stat-value text-lg">
                {testData.filter((l) => l.type === type).length}
              </div>
            </div>
          ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center">
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
            placeholder="Search locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        {/* Type filter as button group */}
        <div className="join">
          {locationTypes.map((type) => (
            <button
              key={type}
              className={`btn btn-sm join-item ${
                typeFilter === type ? "btn-neutral" : "btn-ghost border border-base-300"
              }`}
              onClick={() => setTypeFilter(type)}
            >
              {type === "all" ? "All" : type}
            </button>
          ))}
        </div>

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

      {/* Empty state */}
      {processed.length === 0 && (
        <div className="hero py-16 bg-base-200 rounded-box">
          <div className="hero-content text-center">
            <div>
              <p className="text-4xl mb-3">🗺️</p>
              <h4 className="text-lg font-semibold">No locations found</h4>
              <p className="text-base-content/60 mt-1">
                {search || typeFilter !== "all"
                  ? "Try adjusting your filters."
                  : "Add the first location to get started."}
              </p>
              {(search || typeFilter !== "all") && (
                <button
                  className="btn btn-sm btn-ghost mt-4"
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("all");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Locations list */}
      {processed.length > 0 && (
        <div className="space-y-4">
          {processed.map((location, index) => (
            <div key={location.id ?? index} className="relative">
              {/* Type badge overlay */}
              <div className="absolute top-3 right-3 z-10">
                <span
                  className={`badge ${
                    TYPE_BADGE[location.type] ?? "badge-ghost"
                  } badge-sm`}
                >
                  {location.type}
                </span>
              </div>
              <SeriesLocationCard {...location} />
            </div>
          ))}
        </div>
      )}

      {/* Results count when filtering */}
      {(search || typeFilter !== "all") && processed.length > 0 && (
        <p className="text-sm text-base-content/50 text-right">
          Showing {processed.length} of {testData.length} locations
        </p>
      )}
    </div>
  );
}

export default LocationsTable;