import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CharacterTableCard from "../../ui/character-table-card";
import { fetch_series_characters } from "../../../persistence/CharactersPersistence";
import useCharacterStore from "../../../store/CharacterStore";

//  TODO: Only load relevent information to the page hence call characters from the database 
function CharacterTable() {
    const { id } = useParams<{ id: string }>();
    const { characters, setCharacters } = useCharacterStore();

    const [loading, setLoading] = useState<boolean>();


    console.log("reload")
    useEffect(() => {

        const loadCharacters = async () => {
            try {
                const data = await fetch_series_characters(id!);
                setCharacters(data);
            } catch (error) {
                console.error('Failed to fetch characters:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCharacters();
    }, [id]);

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Characters</h3>

            {loading 
            ? <div>
              <p className="flex justify-center text-center text-5xl">Please wait currently loading</p>  
            </div>
            : <div>
                {Array.isArray(characters) && characters.length > 0 ? (
                    characters.map((character, index) => (
                        <div key={index} className="mb-8">
                            <CharacterTableCard {...character} />
                        </div>
                    ))
                ) : (
                    <p>No characters available.</p>
                )}
            </div>
            }
            
        </div>
    );
}

export default CharacterTable;
