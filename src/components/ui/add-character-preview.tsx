// src/components/content_manager/.../AddCharacterPreview.tsx
import { CharacterProfile } from "../../types";
import { downloadCharacterEpub } from "../../logic/EpubGenerator";

interface AddCharacterProps {
  characterProfile: CharacterProfile;
  characterSheet: string;
}

function AddCharacterPreview(props: AddCharacterProps) {
  const { characterProfile, characterSheet } = props;

  const handleDownloadEpub = () => {
    downloadCharacterEpub(characterProfile, characterSheet);
  };

  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box max-w-4xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg mb-4">
            {characterProfile.identity.name || "Character preview"}
          </h3>

          <div className="card card-side bg-base-100 shadow-sm">
            <figure className="max-w-sm">
              <img
                src={characterSheet}
                alt="Character Sheet"
                className="object-contain max-h-96"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {characterProfile.identity.name ||
                  characterProfile.identity.nickname ||
                  "Unnamed character"}
              </h2>
              <p className="text-sm opacity-80">
                {characterProfile.personality.personality ||
                  "No personality summary provided yet."}
              </p>

              <div className="card-actions justify-end mt-auto">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleDownloadEpub}
                >
                  Download EPUB File
                </button>
              </div>
            </div>
          </div>

          <p className="py-4 text-xs opacity-70">
            The EPUB includes this character sheet plus a structured profile
            laid out similarly to your reference template.
          </p>
        </div>
      </dialog>
    </>
  );
}

export default AddCharacterPreview;
