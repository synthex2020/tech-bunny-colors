import { Character } from "../../types";
import { CharacterEditModal } from "./character-edit-modal";
import { MediaModal } from "./media-modal";

export default function CharacterTableCard(character: Character) {
    let characterSheet = "https://media.istockphoto.com/id/1289220545/photo/beautiful-woman-smiling-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=qmOTkGstKj1qN0zPVWj-n28oRA6_BHQN8uVLIXg0TF8=";
    if (character) {
        if (character.characterSheet === "") {
            characterSheet = "https://media.istockphoto.com/id/1289220545/photo/beautiful-woman-smiling-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=qmOTkGstKj1qN0zPVWj-n28oRA6_BHQN8uVLIXg0TF8=";
        }else {
            characterSheet = character.characterSheet;
        }
    }
    return (
        <div className="card card-side bg-base-100 shadow-sm border">
            <figure>
                {/** Character sheet and reference images  */}
                <img
                    src={characterSheet}
                    alt="character sheet" />
  
            </figure>
            <div className="card-body">
                <h2 className="card-title">{character.titles ?? ""} {character.name}</h2>

                <p className="text text-sm">{character.species} | {character.race} | {character.age}</p>
                <p className="text text-sm">{character.sex} | {character.gender} | {character.orientation}</p>
                <p className="text">
                    {Array.isArray(character.family)
                        ? character.family.map((f: any) => f.name).join(", ")
                        : "No family"
                    } | {character.relationships}
                </p>

                <div className="divider" />

                <p className="text text-sm">{character.hair} | {character.fashion}</p>
                <p className="text text-sm">{character.bodyMods}</p>
                <p className="text text-sm">{character.equipment}</p>
                <p className="text text-sm">{character.martialArts}</p>
                <p className="text text-sm">{character.powers}</p>

                <div className="divider" />
                <p className="text text-sm">{character.hobbies}</p>
                <p className="text text-sm">{character.personality} | {character.anatomy}</p>
                <p className="textarea textarea-bordered">{character.backstory}</p>
                <div className="card-actions justify-end">
                    <CharacterEditModal
                        character={character}
                        onSave={() => { }}
                    />
                </div>
            </div>
        </div>
    );
};


