import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CharacterTableCard from "../../ui/character-table-card";
import { Character } from "../../../types";
import { fetch_series_characters } from "../../../persistence/CharactersPersistence";
import useCharacterStore from "../../../store/CharacterStore";

//  TODO: Only load relevent information to the page hence call characters from the database 
function CharacterTable() {
    const { id } = useParams<{ id: string }>();
    const { characters, setCharacters } = useCharacterStore();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [mediaToShow, setMediaToShow] = useState<string[]>([]);
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

    const CharacterMedia = ({ character }: { character: Character }) => {
        return (
            <div className="flex flex-col">
                {/* MEDIA ITEM */}
                <div className="flex h-1/4">
                    <MediaCarousel images={mediaToShow} />
                </div>

                {/* SELECTOR */}
                <div className="flex flex-row gap-3 justify-center mt-4">

                    <button
                        className="btn btn-sm"
                        onClick={() => setMediaToShow([character.characterSheet])}
                    >
                        Character Sheet
                    </button>
                </div>
            </div>
        );
    };

    const MediaCarousel = ({ images }: { images: string[] }) => {
        if (images.length === 0) return null;

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
                        className={`carousel-item absolute w-full transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <img src={src} className="w-full object-contain" alt={`Slide ${index + 1}`} />
                    </div>
                ))}

                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <button onClick={prevSlide} className="btn btn-circle">❮</button>
                    <button onClick={nextSlide} className="btn btn-circle">❯</button>
                </div>
            </div>
        );
    };


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
                            <CharacterMedia character={character} />
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
