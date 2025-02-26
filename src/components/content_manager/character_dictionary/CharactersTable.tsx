import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import CharacterPopModal from "./CharacterPopModal";

interface Character {
    name: string;
    titles: string;
    sex: string;
    gender: string;
    species: string;
    personality: string;
    family: string[];
    hair: string;
    fashion: string;
    quirks: string;
    relationship: string;
    orientation: string;
    race: string;
    age: string;
    images: string[];
    powers: string;
    martialArts: string;
    hobbies: string;
    equipment: string;
    backstory: string;
    references: string;
    referenceImages: string[];
    characterSheet: string;
    bodyModifications: string;
    anatomyMeasurements: string;
}




function CharacterTable() {
    const location = useLocation();
    const characters = location.state;
    const [display, setDisplay] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    
    //  USE POP UP MODAL INSTEAD SHOW SMALL THUMBNAIL 
    const CharacterMedia = ({ character }: { character: Character }) =>  {
    
        return (
            <div className="flex flex-col">
                {/** MEDIA ITEM  */}
                <div className="flex h-1/4">
                    <MediaCarousel />
                </div>
                {/** SELECTOR  */}
                <div className="flex flex-row gap-3 justify-center">
                    <div
                        className="btn btn-sm"
                        onClick={() => setDisplay(character.images)}
                    >
                        Character Images
                    </div>
                    <div
                        className="btn btn-sm"
                        onClick={() => setDisplay(character.referenceImages)}
                    >
                        Reference Images
                    </div>
                    <div
                        className="btn btn-sm"
                        onClick={() => setDisplay([character.characterSheet])}
                    >
                        Character Sheet
                    </div>
                </div>
            </div>
        );
    }
    
    const MediaCarousel = () => {
    
        const images = display;
        
        const prevSlide = () => {
            setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        };
    
        const nextSlide = () => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        };
    
        return (
            <div className="carousel w-1/4 relative">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className={`carousel-item absolute w-1/4 transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <img src={src} className="w-1/4" alt={`Slide ${index + 1}`} />
                    </div>
                ))}
    
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <button onClick={prevSlide} className="btn btn-circle">❮</button>
                    <button onClick={nextSlide} className="btn btn-circle">❯</button>
                </div>
            </div>
        );
    
    }
    console.log(display);
    return (
        <div className="overflow-x-hidden">
            <table className="table">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Thumbnail</th>
                        <th>Personality</th>
                        <th>Family</th>
                        <th>Hair</th>
                        <th>Fashion</th>
                        <th>Quirks</th>
                        <th>Relationships</th>
                        <th>Powers</th>
                        <th>Martial Arts</th>
                        <th>Hobbies</th>
                        <th>Equipment</th>
                        <th>Body Modifications</th>
                        <th>Anatomy Measurements</th>
                        <th>Backstory</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {characters.map((character: Character, index : number) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <CharacterMedia character={character} />
                            </td>
                            <td>{character.personality}</td>
                            <td>{character.family.join(", ")}</td>
                            <td>{character.hair}</td>
                            <td>{character.fashion}</td>
                            <td>{character.quirks}</td>
                            <td>{character.relationship}</td>
                            <td>{character.powers}</td>
                            <td>{character.martialArts}</td>
                            <td>{character.hobbies}</td>
                            <td>{character.equipment}</td>
                            <td>{character.bodyModifications}</td>
                            <td>{character.anatomyMeasurements}</td>
                            <td>{character.backstory}</td>
                            <td>
                                <CharacterPopModal 
                                    character={character}
                                    modalId={character.name}
                                 />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CharacterTable;
