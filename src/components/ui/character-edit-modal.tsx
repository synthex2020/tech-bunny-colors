import { useState } from "react";
import { Character } from "../../types";

interface CharacterEditModalProps {
  character: Character;
  onSave: (updatedCharacter: Character) => void;
}

export function CharacterEditModal({ character, onSave }: CharacterEditModalProps) {
  const modalId = `${character.id}-modal`;
  const [formData, setFormData] = useState<Character>(character);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    (document.getElementById(modalId) as HTMLDialogElement).close();
  };

  const renderField = (key: keyof Character) => {
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
        Edit Character
      </button>
      <dialog id={modalId} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Edit Character: {character.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto mt-4">
            {Object.keys(formData)
              .filter(key => typeof formData[key as keyof Character] === "string")
              .map(key => renderField(key as keyof Character))}
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
