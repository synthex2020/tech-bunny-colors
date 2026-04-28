import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CharacterTableCard from "../../ui/character-table-card";
import { fetch_series_characters } from "../../../persistence/CharactersPersistence";
import useCharacterStore from "../../../store/CharacterStore";

function CharacterTable() {
  const { id } = useParams<{ id: string }>();
  const { characters, setCharacters } = useCharacterStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetch_series_characters(id!);
        setCharacters(data);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
        setError("Failed to load characters. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadCharacters();
  }, [id]);

  const filtered =
    Array.isArray(characters) && search.trim()
      ? characters.filter((c: any) =>
          c.name?.toLowerCase().includes(search.toLowerCase())
        )
      : characters;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">Characters</h3>
          {!loading && Array.isArray(characters) && (
            <div className="badge badge-neutral badge-lg">
              {characters.length}
            </div>
          )}
        </div>

        {/* Search */}
        {!loading && Array.isArray(characters) && characters.length > 0 && (
          <label className="input input-bordered input-sm flex items-center gap-2 w-64">
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
              placeholder="Search characters…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card bg-base-200 animate-pulse">
              <div className="card-body gap-3">
                <div className="h-5 bg-base-300 rounded w-1/3" />
                <div className="h-4 bg-base-300 rounded w-2/3" />
                <div className="h-4 bg-base-300 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && Array.isArray(filtered) && filtered.length === 0 && (
        <div className="hero py-16 bg-base-200 rounded-box">
          <div className="hero-content text-center">
            <div>
              <p className="text-4xl mb-3">🎭</p>
              <h4 className="text-lg font-semibold">
                {search ? "No characters match your search" : "No characters yet"}
              </h4>
              <p className="text-base-content/60 mt-1">
                {search
                  ? "Try a different name."
                  : "Characters added to this series will appear here."}
              </p>
              {search && (
                <button
                  className="btn btn-sm btn-ghost mt-4"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Character list */}
      {!loading && !error && Array.isArray(filtered) && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((character: any, index: number) => (
            <div key={character.id ?? index}>
              <CharacterTableCard {...character} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterTable;