import { useState } from "react";
import { useNavigate } from "react-router";
import { Series } from "../../../types";

interface SeriesProps {
  series: Series;
  modalId: string;
}

function SeriesMoreDetailsModal({ series, modalId }: SeriesProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Use a stable, unique dialog ID that won't clash across multiple cards
  const dialogId = `series-detail-modal-${modalId}`;

  const tabs = [
    { label: "Plot",    content: series.plot    },
    { label: "History", content: series.history  },
    { label: "World",   content: series.world    },
    { label: "Physics", content: series.physics  },
  ];

  const handleOpen = () => {
    setActiveTab(0); // always reset to first tab on open
    (document.getElementById(dialogId) as HTMLDialogElement)?.showModal();
  };

  const handleClose = () => {
    (document.getElementById(dialogId) as HTMLDialogElement)?.close();
  };

  return (
    <>
      <button className="btn btn-primary btn-sm gap-2" onClick={handleOpen}>
        Details
      </button>

      <dialog id={dialogId} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-11/12 max-h-[90vh] max-w-6xl p-0 overflow-hidden bg-base-200">

          {/* ── Close button ── */}
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-50"
              onClick={() => setActiveTab(0)}
            >
              ✕
            </button>
          </form>

          <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">

            {/* ── Left Column: Image & Quick Stats ── */}
            <div className="lg:w-1/3 bg-base-300 p-6 flex flex-col items-center gap-4 overflow-y-auto">
              <div className="shadow-2xl rounded-lg overflow-hidden border-4 border-primary/20 w-full">
                <img
                  src={series.thumbnail}
                  alt={`${series.title} cover`}
                  className="w-full object-cover"
                />
              </div>

              <div className="stats stats-vertical shadow w-full bg-base-100">
                <div className="stat py-2">
                  <div className="stat-title text-xs">Issues / Volumes</div>
                  <div className="stat-value text-lg text-primary">
                    {series.issues} / {series.volumes}
                  </div>
                </div>
                <div className="stat py-2">
                  <div className="stat-title text-xs">Audience</div>
                  <div className="stat-value text-lg">{series.audience}</div>
                </div>
                <div className="stat py-2">
                  <div className="stat-title text-xs">Status</div>
                  <div
                    className={`stat-value text-lg ${
                      series.status === "Ongoing" ? "text-success" : "text-warning"
                    }`}
                  >
                    {series.status}
                  </div>
                </div>
              </div>

              {/* Published / Merch badges */}
              <div className="flex gap-2 flex-wrap justify-center w-full">
                <div className={`badge badge-sm ${series.published ? "badge-success" : "badge-ghost"}`}>
                  {series.published ? "Published" : "Unpublished"}
                </div>
                <div className={`badge badge-sm ${series.merchandise ? "badge-accent" : "badge-ghost"}`}>
                  {series.merchandise ? "Has Merch" : "No Merch"}
                </div>
              </div>

              <p className="text-xs text-base-content/40 w-full text-left">
                Created: {series.createdAt}
              </p>
            </div>

            {/* ── Right Column ── */}
            <div className="lg:w-2/3 p-6 flex flex-col gap-4 overflow-y-auto">

              {/* Series Header */}
              <header>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-primary leading-tight">
                  {series.title}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {series.genre.split(",").map((g) => (
                    <div key={g} className="badge badge-outline badge-sm opacity-70">
                      {g.trim()}
                    </div>
                  ))}
                  {series.powerSystem && (
                    <div className="text text-primary-content">
                      ⚡ {series.powerSystem}
                    </div>
                  )}
                </div>
                <p className="text-sm mt-3 text-base-content/70">
                  <span className="font-semibold">Writer:</span> {series.authors}
                  {series.artists && (
                    <> · <span className="font-semibold">Artist:</span> {series.artists}</>
                  )}
                </p>
              </header>

              {/* ── Navigation Buttons ── */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    handleClose();
                    navigate("/characterDir/importantEvents", {
                      state: series.timeline,
                    });
                  }}
                >
                  📅 Events
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    handleClose();
                    navigate("/characterDir/locationsTable", {
                      state: series.locations,
                    });
                  }}
                >
                  📍 Locations
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    handleClose();
                    navigate(`/characterDir/charactersTable/${series.id}`);
                  }}
                >
                  👥 Characters
                </button>
              </div>

              {/* ── Tabs ── */}
              <div>
                <div role="tablist" className="tabs tabs-lifted">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.label}
                      role="tab"
                      aria-selected={activeTab === index}
                      aria-controls={`tabpanel-${dialogId}-${index}`}
                      id={`tab-${dialogId}-${index}`}
                      className={`tab ${
                        activeTab === index
                          ? "tab-active [--tab-bg:var(--fallback-b1,oklch(var(--b1)))]"
                          : ""
                      }`}
                      onClick={() => setActiveTab(index)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div
                  role="tabpanel"
                  id={`tabpanel-${dialogId}-${activeTab}`}
                  aria-labelledby={`tab-${dialogId}-${activeTab}`}
                  className="bg-base-100 p-5 rounded-b-lg border-x border-b border-base-300 min-h-48 max-h-72 overflow-y-auto"
                >
                  {tabs[activeTab].content ? (
                    <p className="leading-relaxed text-base-content/80 text-sm whitespace-pre-line">
                      {tabs[activeTab].content}
                    </p>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 gap-2 text-base-content/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs">No information available for this section.</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setActiveTab(0)}>close</button>
        </form>
      </dialog>
    </>
  );
}

export default SeriesMoreDetailsModal;