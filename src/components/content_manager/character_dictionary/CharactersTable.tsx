import { useState } from "react";
import { useLocation } from "react-router";
import { CharacterTableCard } from "../../ui/character-table-card";
import { Character } from "../../../types";



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
       <div>
         {characters.map((character: Character, index: number) => {
            return (
                <div key={index}>
                    <CharacterTableCard {
                    ...character
                }/>
                </div>
            );
         })}
       </div>
    );
}

export default CharacterTable;
