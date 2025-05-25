import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CharacterTableCard from "../../ui/character-table-card";
import { Character } from "../../../types";
import useSeriesStore from "../../../store/SeriesStore";

function CharacterTable() {
    const {id} = useParams<{id: string}>();

    const [characters, setCharacters] = useState<Character[]>();

    const currentSeries = useSeriesStore((state) => state.current);
    const seriesCharacters = useSeriesStore((state) => state.characters);

    
    const fetchSeries = useSeriesStore((state) => state.fetchSeries);
    const setCharactersInSeries = useSeriesStore((state) => state.setCharacters);

    useEffect(() => {
        fetchSeries(id!)
        setCharactersInSeries(currentSeries.characters);
        setCharacters(seriesCharacters);
    } , [characters]);



    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Characters</h3>
            {characters === undefined 
            ? <div></div>
            :currentSeries.characters.map((character : Character, index) => (
                <div key={index} className="mb-8">
                    <CharacterTableCard {...character} />
                    
                </div>
            )) }
        </div>
    );
}

export default CharacterTable;
