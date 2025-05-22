import { Character } from "../../types";
import { CharacterEditModal } from "./character-edit-modal";

export default function CharacterTableCard(character: Character) {
    console.log(character);
    return (
        <div className="card card-side bg-base-100 shadow-sm border">
            <h3>Hello</h3>
            <figure>
                {/** Character sheet and reference images  */}
                <img
                    src={character.characterSheet}
                    alt="character sheet" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{character.titles} {character.name}</h2>

                <p className="text text-sm">{character.species} | {character.race} | {character.age}</p>
                <p className="text text-sm">{character.sex} | {character.gender} | {character.orientation}</p>
                <p className="text">{character.family} | {character.relationships}</p>
                <div className="divider" />

                <p className="text text-sm">{character.hair} | {character.fashion}</p>
                <p className="text text-sm">{character.bodyMods}</p>
                <p className="text text-sm">{character.equipment}</p>
                <p className="text text-sm">{character.martialArts}</p>
                <p className="text text-sm">{character.powers}</p>

                <div className="divider"/>
                <p className="text text-sm">{character.hobbies}</p>
                <p className="text text-sm">{character.personality} | {character.anatomy}</p>
                <p className="textarea textarea-bordered">{character.backstory}</p>
                <div className="card-actions justify-end">
                    <CharacterEditModal 
                        character={character}
                        onSave={() => {}}
                    />
                </div>
            </div>
        </div>
    );
};


