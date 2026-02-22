import { useEffect, useState } from 'react';
import SeriesCard from './SeriesCard';
import { fetch_available_series } from '../../../persistence/SeriesPerisistence';
import useSeriesStore from '../../../store/SeriesStore';

// TODO: Only fetch the information to be displayed to the user in the immediate vicinity

type QuickActionProps = {
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
  color: 'primary' | 'secondary' | 'accent';
};

function QuickActionCard({ icon, label, description, onClick, color }: QuickActionProps) {
  return (
    <div
      className={`card bg-base-200 border border-base-300 hover:border-${color} hover:shadow-lg transition-all duration-200 cursor-pointer group`}
      onClick={onClick}
    >
      <div className="card-body p-4 flex flex-row items-center gap-4">
        <div className={`btn btn-${color} btn-circle btn-md pointer-events-none`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm group-hover:text-${color} transition-colors`}>{label}</p>
          <p className="text-xs text-base-content/60 truncate">{description}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/30 group-hover:text-base-content/60 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

function CharacterDirectory() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTips, setShowTips] = useState(false);
  const availableSeries = useSeriesStore((state) => state.series);
  const setGlobalSeries = useSeriesStore((state) => state.setSeries);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const data = await fetch_available_series();
        setGlobalSeries(data);
      } catch (error) {
        console.error('Failed to fetch series:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSeries();
  }, []);

  const filteredSeries = availableSeries.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCharacter = () => {
    // TODO: Open Add Character modal or navigate to Add Character page
    console.log('Add Character clicked');
  };

  const handleAddEvent = () => {
    // TODO: Open Add Event modal or navigate to Add Event page
    console.log('Add Event clicked');
  };

  const handleAddLocation = () => {
    // TODO: Open Add Location modal or navigate to Add Location page
    console.log('Add Location clicked');
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* ── Top Navbar ── */}
      <div className="navbar bg-base-200 border-b border-base-300 px-4 sticky top-0 z-30 shadow-sm">
        <div className="navbar-start">
          <div className="flex items-center gap-2">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-lg w-8 h-8 flex items-center justify-center text-sm font-bold">
                CH
              </div>
            </div>
            <span className="font-bold text-base hidden sm:inline">Caleido-Hope Labs</span>
          </div>
        </div>

        <div className="navbar-center hidden md:flex">
          <label className="input input-sm input-bordered flex items-center gap-2 w-72">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search series…"
              className="grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="opacity-50 hover:opacity-100" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </label>
        </div>

        <div className="navbar-end gap-2">
          <button
            className="btn btn-ghost btn-sm gap-1"
            onClick={() => setShowTips((v) => !v)}
            title="Toggle operation tips"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
            <span className="hidden sm:inline text-xs">Tips</span>
          </button>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-primary btn-sm gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-base-200 border border-base-300 rounded-box w-52 mt-2 z-40">
              <li className="menu-title text-xs opacity-60 px-2 py-1">Create Entry</li>
              <li>
                <button onClick={handleAddCharacter} className="gap-2">
                  <span>🧑</span> Add Character
                </button>
              </li>
              <li>
                <button onClick={handleAddEvent} className="gap-2">
                  <span>📅</span> Add Event
                </button>
              </li>
              <li>
                <button onClick={handleAddLocation} className="gap-2">
                  <span>📍</span> Add Location
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* ── Tips & Notes Banner ── */}
        {showTips && (
          <div role="alert" className="alert bg-info/10 border border-info/30 mb-6 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
            <div>
              <p className="font-semibold text-info mb-1">Operation Notes</p>
              <ul className="list-disc list-inside space-y-1 text-base-content/80">
                <li>Use <kbd className="kbd kbd-xs">Add New</kbd> in the top-right to create Characters, Events, or Locations.</li>
                <li>Each <strong>Series Card</strong> links to its full encyclopedia entry — click to expand details.</li>
                <li>The search bar filters series by name in real-time; no page reload required.</li>
                <li>Characters, Events, and Locations are scoped per series. Assign them during creation.</li>
                <li>Lazy loading is planned — large libraries may take a moment on first load.</li>
              </ul>
            </div>
            <button className="btn btn-ghost btn-xs self-start" onClick={() => setShowTips(false)}>✕</button>
          </div>
        )}

        {/* ── Page Header ── */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Characters & Story Encyclopedia</h1>
              <p className="text-base-content/60 mt-1 text-sm">Internal reference for Caleido-Hope Labs narratives, characters, events, and locations.</p>
            </div>

            {/* Stats strip */}
            {!loading && (
              <div className="flex gap-3 shrink-0">
                <div className="stat bg-base-200 rounded-box p-3 min-w-0">
                  <div className="stat-title text-xs">Series</div>
                  <div className="stat-value text-2xl">{availableSeries.length}</div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile search */}
          <label className="input input-sm input-bordered flex items-center gap-2 w-full mt-4 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search series…"
              className="grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </header>

        {/* ── Quick Actions ── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <QuickActionCard
            icon="🧑"
            label="Add Character"
            description="Create a new character profile"
            onClick={handleAddCharacter}
            color="primary"
          />
          <QuickActionCard
            icon="📅"
            label="Add Event"
            description="Log a story event or milestone"
            onClick={handleAddEvent}
            color="secondary"
          />
          <QuickActionCard
            icon="📍"
            label="Add Location"
            description="Register a place in the world"
            onClick={handleAddLocation}
            color="accent"
          />
        </section>

        {/* ── Divider ── */}
        <div className="divider text-xs text-base-content/40 mb-6">All Series</div>

        {/* ── Series Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card bg-base-200 shadow-sm">
                <div className="card-body gap-3">
                  <div className="skeleton h-6 w-3/4 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-5/6 rounded" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSeries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-base-content/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">No series found</p>
            {searchQuery && (
              <button className="btn btn-sm btn-ghost" onClick={() => setSearchQuery('')}>Clear search</button>
            )}
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeries.map((item, index) => (
              <SeriesCard key={item.id ?? index} series={item} index={index} seriesId={item.id} />
            ))}
          </section>
        )}

        {/* ── Footer Note ── */}
        <div className="divider mt-12 mb-4" />
        <footer className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-base-content/40 pb-6">
          <span>Caleido-Hope Labs · Internal Use Only</span>
          <span>
            {!loading && filteredSeries.length > 0 && `Showing ${filteredSeries.length} of ${availableSeries.length} series`}
          </span>
        </footer>
      </div>
    </div>
  );
}

export default CharacterDirectory;