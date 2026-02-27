// QuickPrefillPanel.tsx
// Drop this component near the top of the AddNewCharacter form.
// It renders a collapsible panel with preset buttons.

import { useState } from "react";
import { PREFILL_PRESETS, type PrefillPreset } from "../../../libs/CharacterPrefills";
import type { CharacterProfile } from "../../../types";

type ExtraFields = {
  titles: string;
  hair: string;
  fashion: string;
  equipment: string;
  powers: string;
  orientation: string;
  bodyModifications: string;
  model: string;
};

type Props = {
  onApply: (profile: CharacterProfile, extra: ExtraFields) => void;
};

export default function QuickPrefillPanel({ onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState<string | null>(null);
  const [confirmPreset, setConfirmPreset] = useState<PrefillPreset | null>(null);

  const handleSelect = (preset: PrefillPreset) => {
    // If form already has an applied preset, confirm before overwriting
    if (applied && preset.label !== "Clear Form") {
      setConfirmPreset(preset);
      return;
    }
    applyPreset(preset);
  };

  const applyPreset = (preset: PrefillPreset) => {
    onApply(preset.profile, preset.extra);
    setApplied(preset.label === "Clear Form" ? null : preset.label);
    setConfirmPreset(null);
    // Briefly flash success
  };

  return (
    <div
      className={`border rounded-xl mb-6 transition-all duration-200 ${
        open
          ? "border-primary shadow-md bg-base-100"
          : "border-base-300 bg-base-200 hover:border-primary/40"
      }`}
    >
      {/* Header row */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">⚡</span>
          <div>
            <p className="font-semibold text-sm">Quick Prefill</p>
            <p className="text-xs opacity-60">
              {applied
                ? `Template loaded: ${applied} — click to change`
                : "Load a template to skip manual entry (demos, side chars, etc.)"}
            </p>
          </div>
          {applied && (
            <span className="badge badge-primary badge-sm ml-2">{applied}</span>
          )}
        </div>
        <span
          className={`transition-transform duration-200 text-base opacity-60 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="px-5 pb-5 pt-2 space-y-3 border-t border-base-300">
          <p className="text-xs opacity-50 mt-1">
            Selecting a template overwrites all current form fields. You can
            still edit any field after applying.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {PREFILL_PRESETS.map((preset) => {
              const isActive = applied === preset.label;
              const isClear = preset.label === "Clear Form";

              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelect(preset)}
                  className={`
                    group relative flex flex-col gap-1 rounded-lg border p-3 text-left
                    transition-all duration-150 hover:shadow-sm
                    ${
                      isActive
                        ? "border-primary bg-primary/10"
                        : isClear
                        ? "border-error/30 bg-error/5 hover:border-error hover:bg-error/10"
                        : "border-base-300 bg-base-100 hover:border-primary/60 hover:bg-base-200"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl leading-none">{preset.emoji}</span>
                    <span
                      className={`font-semibold text-sm ${
                        isClear ? "text-error" : ""
                      }`}
                    >
                      {preset.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-primary text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-60 leading-snug">
                    {preset.description}
                  </p>
                  {!isClear && !isActive && (
                    <span className="absolute inset-0 rounded-lg ring-1 ring-transparent group-hover:ring-primary/30 pointer-events-none transition-all" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm overwrite modal */}
      {confirmPreset && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-base mb-1">Replace current template?</h3>
            <p className="text-sm opacity-70">
              You already have <strong>{applied}</strong> loaded. Loading{" "}
              <strong>{confirmPreset.label}</strong> will overwrite all fields.
            </p>
            <div className="modal-action mt-4">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setConfirmPreset(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => applyPreset(confirmPreset)}
              >
                Replace
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setConfirmPreset(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}