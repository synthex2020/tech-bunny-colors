import { downloadCharacterEpub } from "../../logic/EpubGenerator";
import { Character, CharacterProfile } from "../../types";
import { CharacterEditModal } from "./character-edit-modal";

export default function CharacterTableCard(character: Character) {
    let characterSheet = "https://media.istockphoto.com/id/1289220545/photo/beautiful-woman-smiling-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=qmOTkGstKj1qN0zPVWj-n28oRA6_BHQN8uVLIXg0TF8=";
    let characterAnatomy : CharacterProfile;

    if (character) {
        if (character.character_sheet === "") {
            characterSheet = "https://media.istockphoto.com/id/1289220545/photo/beautiful-woman-smiling-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=qmOTkGstKj1qN0zPVWj-n28oRA6_BHQN8uVLIXg0TF8=";
        }else {
            characterSheet = character.character_sheet;
        }
        const resultantUrl = character.anatomy.replace('"\\', '').replace('\\""', '');
        
        fetch(resultantUrl).then(function(response){
            return response.json();
        }).then(function(myJson) {
            console.log(resultantUrl);
            characterAnatomy = myJson;
        }); 
    }
    console.log(characterSheet);
    
    return (
        <div className="card card-side bg-base-100 shadow-sm border">
            <figure>
                {/** Character sheet and reference images  */}
               <div className="flex flex-col p-2 gap-6 justify-center">
                <a
                    href={characterSheet}
                    target="_blank"
               >
                 <img
                    src={characterSheet}
                    alt="character sheet" />
               </a>

               <div className="btn bg-primary text-white">
                    View References
               </div>
               </div>
  
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

                    <div 
                        className="btn" 
                        onClick={async () => downloadCharacterEpub(
                            characterAnatomy,
                            character.character_sheet
                        ) }
                    >
                        Epub Download
                    </div>
                </div>
            </div>
        </div>
    );
};


