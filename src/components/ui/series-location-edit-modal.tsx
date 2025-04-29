import { useState } from "react";
import { SeriesLocation } from "../../types";

interface SeriesLocationEditModalProps {
  location: SeriesLocation;
  onSave: (updatedLocation: SeriesLocation) => void;
}

export function SeriesLocationEditModal({ location, onSave }: SeriesLocationEditModalProps) {
  const modalId = `${location.id}-modal`;
  const [formData, setFormData] = useState<SeriesLocation>(location);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, value: string) => {
    const newArray = [...formData.locationMedia];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, locationMedia: newArray }));
  };

  const addMediaItem = () => {
    setFormData(prev => ({ ...prev, locationMedia: [...prev.locationMedia, ""] }));
  };

  const removeMediaItem = (index: number) => {
    const newArray = [...formData.locationMedia];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, locationMedia: newArray }));
  };

  const handleSubmit = () => {
    onSave(formData);
    (document.getElementById(modalId) as HTMLDialogElement).close();
  };

  const renderField = (key: keyof SeriesLocation) => {
    if (key === "locationMedia") return null;
    return (
      <div key={key} className="form-control w-full">
        <label className="label">
          <span className="label-text capitalize">{key}</span>
        </label>
        <textarea
          name={key}
          value={(formData[key] as string) || ""}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
        />
      </div>
    );
  };

  return (
    <div>
      <button
        className="btn"
        onClick={() => (document.getElementById(modalId) as HTMLDialogElement).showModal()}
      >
        Edit Location
      </button>
      <dialog id={modalId} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Edit Location: {location.title}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto mt-4">
            {Object.keys(formData)
              .filter(key => key !== "locationMedia")
              .map(key => renderField(key as keyof SeriesLocation))}

            <div className="form-control w-full md:col-span-2">
              <label className="label">
                <span className="label-text">Location Media (URLs)</span>
              </label>
              {formData.locationMedia.map((media, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={media}
                    onChange={(e) => handleArrayChange(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-error btn-sm"
                    onClick={() => removeMediaItem(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-accent btn-sm mt-2" onClick={addMediaItem}>
                + Add Media
              </button>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Save
              </button>
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
