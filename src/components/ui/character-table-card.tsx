import { Character } from "../../types";
import { CharacterEditModal } from "./character-edit-modal";
import { MediaModal } from "./media-modal";

export default function CharacterTableCard(character: Character) {
    console.log(character);
    

    const fix_json_structure = (json_string: string) => {
        return JSON.parse(json_string);
    };

    const characterReferenceImages = fix_json_structure(character.reference_images);
    const characterSheet = [character.character_sheet];
    const characterMedia = character.media;

    console.log('Reference Images :', characterReferenceImages)
    //console.log('Character Sheet :', characterSheet)
    //console.log('Character Media  :', characterMedia)

    return (
        <div className="card card-side bg-base-100 shadow-sm border w-1/2">
            <figure>
                {/** Character sheet and reference images  */}
                <div className="flex flex-col gap-6 justify-center p-6">
                    <img
                        src={character.character_sheet || 'https://mkcijqngeshomivhjrbe.supabase.co/storage/v1/object/public/image-bucket/images/default_sheet.jpeg'}
                        alt="character sheet" />
                    <MediaModal identity={character.id} images={[...characterSheet, ...characterMedia]} />
                </div>
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


