import { useState } from "react";
import { SeriesEvent } from "../../types";

interface SeriesEventsEditModalProps {
  event: SeriesEvent;
  onSave: (updatedEvent: SeriesEvent) => void;
}

export function SeriesEventsEditModal({ event, onSave }: SeriesEventsEditModalProps) {
  const modalId = `${event.id}-modal`;
  const [formData, setFormData] = useState<SeriesEvent>(event);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, value: string) => {
    const newArray = [...formData.eventsMedia];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, eventsMedia: newArray }));
  };

  const addMediaItem = () => {
    setFormData(prev => ({ ...prev, eventsMedia: [...prev.eventsMedia, ""] }));
  };

  const removeMediaItem = (index: number) => {
    const newArray = [...formData.eventsMedia];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, eventsMedia: newArray }));
  };

  const handleSubmit = () => {
    onSave(formData);
    (document.getElementById(modalId) as HTMLDialogElement).close();
  };

  const renderField = (key: keyof SeriesEvent) => {
    if (key === "eventsMedia") return null;
    return (
      <div key={key} className="form-control w-full">
        <label className="label">
          <span className="label-text capitalize">{key}</span>
        </label>
        {key === "description" ? (
          <textarea
            name={key}
            value={formData[key] as string}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        ) : (
          <input
            type={key === "date" ? "date" : "text"}
            name={key}
            value={formData[key] as string}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <button
        className="btn"
        onClick={() => (document.getElementById(modalId) as HTMLDialogElement).showModal()}
      >
        Edit Event
      </button>
      <dialog id={modalId} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Edit Event: {event.title}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto mt-4">
            {Object.keys(formData)
              .filter(key => key !== "eventsMedia")
              .map(key => renderField(key as keyof SeriesEvent))}

            <div className="form-control w-full md:col-span-2">
              <label className="label">
                <span className="label-text">Event Media (URLs)</span>
              </label>
              {formData.eventsMedia.map((media, idx) => (
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


