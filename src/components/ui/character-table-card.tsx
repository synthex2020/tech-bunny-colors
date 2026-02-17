import { useEffect, useState } from "react";
import { downloadCharacterEpub } from "../../logic/EpubGenerator";
import { Character, CharacterProfile } from "../../types";
import { CharacterEditModal } from "./character-edit-modal";

export default function CharacterTableCard(character: Character) {
  const [characterSheet, setCharacterSheet] = useState(
    "https://media.istockphoto.com/id/1289220545/photo/beautiful-woman-smiling-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=qmOTkGstKj1qN0zPVWj-n28oRA6_BHQN8uVLIXg0TF8="
  );

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    if (!character?.character_sheet) return;

    // DEFAULT CASE
    if (
      character.character_sheet === "" ||
      character.character_sheet.includes("media.istockphoto")
    ) {
      setCharacterSheet(
        "https://media.istockphoto.com/id/1289220545/photo/beautiful-woman-smiling-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=qmOTkGstKj1qN0zPVWj-n28oRA6_BHQN8uVLIXg0TF8="
      );
      return;
    }

    // BLOB CASE
    if (character.character_sheet.startsWith("blob:")) {
      fetch(character.character_sheet)
        .then((res) => res.blob())
        .then((blob) => blobToBase64(blob))
        .then((base64) => setCharacterSheet(base64))
        .catch(() => {});
      return;
    }

    // NORMAL URL CASE
    setCharacterSheet(character.character_sheet);
  }, [character]);

  return (
    <div className="card card-side bg-base-100 shadow-sm border">
      <figure>
        {/** Character sheet and reference images  */}
        <div className="flex flex-col p-2 gap-6 justify-center">
          {!characterSheet.startsWith("blob:") ? (
            <a href={characterSheet} target="_blank">
              <img src={characterSheet} alt="character sheet" />
            </a>
          ) : (
            <img src={characterSheet} alt="character sheet" />
          )}

          <div className="btn bg-primary text-white">View References</div>
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {character.titles ?? ""} {character.name}
        </h2>

        <p className="text text-sm">
          {character.species} | {character.race} | {character.age}
        </p>
        <p className="text text-sm">
          {character.sex} | {character.gender} | {character.orientation}
        </p>
        <p className="text">
          {Array.isArray(character.family)
            ? character.family.map((f: any) => f.name).join(", ")
            : "No family"}{" "}
          | {character.relationships}
        </p>

        <div className="divider" />

        <p className="text text-sm">
          {character.hair} | {character.fashion}
        </p>
        <p className="text text-sm">{character.bodyMods}</p>
        <p className="text text-sm">{character.equipment}</p>
        <p className="text text-sm">{character.martialArts}</p>
        <p className="text text-sm">{character.powers}</p>

        <div className="divider" />
        <p className="text text-sm">{character.hobbies}</p>
        <p className="text text-sm">
          {character.personality} | {character.anatomy}
        </p>
        <p className="textarea textarea-bordered">{character.backstory}</p>
        <div className="card-actions justify-end">
          <CharacterEditModal character={character} onSave={() => {}} />

          <div
            className="btn"
            onClick={async () => {
              if (character.anatomy.includes(".json")) {
                try {
                  // Convert Supabase API URL → Public file URL
                  let anatomyUrl = character.anatomy;

                  if (anatomyUrl.includes("supabase.co/storage/v1/object")) {
                    // Extract bucket and file path
                    const parts = anatomyUrl.split("/object/public/");
                    const bucketAndPath = parts[1]; // json-bucket/profiles/xxx.json

                    const bucket = bucketAndPath.split("/")[0];
                    const filePath = bucketAndPath.replace(bucket + "/", "");

                    // Construct real public file URL
                    anatomyUrl = `https://mkcijqngeshomivhjrbe.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
                  }
                  console.log(anatomyUrl);
                  const response = await fetch(anatomyUrl.trim().replace(/^"|"$/g, ""));

                  if (!response.ok) {
                    console.error("HTTP ERROR", response.status);
                    alert("Failed to load .json file");
                    return;
                  }

                  const rawText = await response.text();

                  let finalResult: CharacterProfile;

                  try {
                    finalResult = JSON.parse(rawText);
                  } catch (err) {
                    console.error("JSON PARSE ERROR:", err);
                    alert("File is not valid JSON");
                    return;
                  }

                  downloadCharacterEpub(finalResult, character.character_sheet);
                } catch (err) {
                  console.error(err);
                  alert("Network error");
                }
              } else {
                alert("Function is not available for this character");
              }
            }}
          >
            Epub Download
          </div>
        </div>
      </div>
    </div>
  );
}
