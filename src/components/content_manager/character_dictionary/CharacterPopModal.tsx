import { useState } from 'react'


//  SHOW CHARACTER DETAILS 
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
    anatomyMeasurements: string
}

interface CharacterModalProps {
    character: Character;
    modalId: string;
}






function CharacterPopModal(character: CharacterModalProps) {
    const [displayCarousel, setDisplayCarousel] = useState(<></>);
    const [selectedButton, setSelectedButton] = useState(0);

    const radioButtonCheck = (buttonNumber: number, character: Character) => {

        if (buttonNumber == 0) {
            //  IMAGES 
            let images = character.images;
            let carousel = <>
                <div className="carousel w-1/2">
    
                    {images.map((source, index) => {
    
                        const prevSlideNumber = index === 0 ? images.length : index;
                        const nextSlideNumber = index === images.length - 1 ? 1 : index + 2;
                        const prevSlide = "#slide" + prevSlideNumber;
                        const nextSlide = "#slide" + nextSlideNumber;
    
                        return (
                            <div
                                id={"slide" + "" + (index + 1)}
                                key={index}
                                className='carousel-item relative w-1/2'
                            >
                                <img
                                    src={source}
                                    className='w-1/2'
                                />
    
                                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                    <a href={prevSlide} className="btn btn-circle">❮</a>
                                    <a href={nextSlide} className="btn btn-circle">❯</a>
                                </div>
                            </div>
                        );
                    })}
    
                    <div id="slide1" className="carousel-item relative w-1/2">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
                            className="w-full" />
                        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                            <a href="#slide4" className="btn btn-circle">❮</a>
                            <a href="#slide2" className="btn btn-circle">❯</a>
                        </div>
                    </div>
                </div>
            </>;
            setDisplayCarousel(carousel);
            setSelectedButton(0);
        } // end if 
    
        if (buttonNumber == 1) {
            //  CHARACTER SHEET 
            let carousel = <>
                <img src={character.characterSheet} className='w-1/2' />
            </>;
            setDisplayCarousel(carousel);
            setSelectedButton(1);
        } // end if 
    
        if (buttonNumber == 2) {
            //  REFERENCE IMAGES 
            let images = character.referenceImages;
            let carousel = <>
                <div className="carousel w-1/2">
    
                    {images.map((source, index) => {
    
                        const prevSlideNumber = index === 0 ? images.length : index;
                        const nextSlideNumber = index === images.length - 1 ? 1 : index + 2;
                        const prevSlide = "#slide" + prevSlideNumber;
                        const nextSlide = "#slide" + nextSlideNumber;
    
                        return (
                            <div
                                id={"slide" + "" + (index + 1)}
                                key={index}
                                className='carousel-item relative w-1/2'
                            >
                                <img
                                    src={source}
                                    className='w-1/2'
                                />
    
                                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                    <a href={prevSlide} className="btn btn-circle">❮</a>
                                    <a href={nextSlide} className="btn btn-circle">❯</a>
                                </div>
                            </div>
                        );
                    })}
    
                    <div id="slide1" className="carousel-item relative w-1/2">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
                            className="w-full" />
                        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                            <a href="#slide4" className="btn btn-circle">❮</a>
                            <a href="#slide2" className="btn btn-circle">❯</a>
                        </div>
                    </div>
                </div>
            </>;
            setDisplayCarousel(carousel);
            setSelectedButton(2);
        }// end if 
    }
    
    const radioButtonDisplay = (character : Character) => {
    
        if (selectedButton === 0) {
            return (
                <>
                    <input
                        type="radio"
                        name="radio-5"
                        className="radio radio-success"
                        defaultChecked
                        onClick={() => radioButtonCheck(0,character)}
                    />
                    <input 
                        type="radio" 
                        name="radio-5" 
                        className="radio radio-success" 
                        onClick={() => radioButtonCheck(1,character)}
    
                    />
                    <input 
                        type="radio" 
                        name="radio-5" 
                        className="radio radio-success" 
                        onClick={() => radioButtonCheck(2,character)}
    
                    />
                </>
            );
        } else if (selectedButton === 1) {
            return (
                <>
                    <input
                        type="radio"
                        name="radio-5"
                        className="radio radio-success"
                        onClick={() => radioButtonCheck(0,character)}
                    />
                    <input 
                        type="radio" 
                        name="radio-5" 
                        className="radio radio-success" 
                        defaultChecked
                        onClick={() => radioButtonCheck(1,character)}
                    />
                    <input 
                        type="radio" 
                        name="radio-5" 
                        className="radio radio-success" 
                        onClick={() => radioButtonCheck(2,character)}
    
                    />
                </>
            );
        } else {
            return (
                <>
                    <input
                        type="radio"
                        name="radio-5"
                        className="radio radio-success"
                        onClick={() => radioButtonCheck(0,character)}
                    />
                    <input 
                        type="radio" 
                        name="radio-5" 
                        className="radio radio-success"
                        onClick={() => radioButtonCheck(1,character)} 
                    />
                    <input 
                        type="radio" 
                        name="radio-5" 
                        className="radio radio-success"
                        defaultChecked 
                        onClick={() => radioButtonCheck(2,character)}
    
                    />
                </>
            );
        }
    }

    return (
        <div>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
                className="btn"
                onClick={() => (document.getElementById(character.modalId) as HTMLDialogElement)?.showModal()}>
                View Character
            </button>
            <dialog id={character.modalId} className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <div className="hero bg-base-200 min-h-screen">
                        <div className="hero-content flex-col lg:flex-row">
                            {/** IMAGE CARASOL HERE */}
                            <div>
                                {/** IMAGES  */}
                                {displayCarousel}
                                {/** RADIO BUTTONS */}
                                {radioButtonDisplay(character.character)}
                            </div>
                            <div>
                                {/** CHARACTER DETAILS */}
                                <h1 className="text-5xl font-bold">
                                    {character.character.name}
                                </h1>
                                <h4 className="text-2xl">
                                    {character.character.titles}
                                </h4>
                                <h2 className="text-4xl font-bold">
                                    {character.character.age.toString()} years <br />
                                    Sex: {character.character.sex} <br />
                                    Gender: {character.character.gender} <br />
                                    Orientation : {character.character.orientation} <br />
                                    Relationsips : {character.character.relationship} <br />
                                    Species: {character.character.species} <br />
                                    Race : {character.character.race} <br />
                                    Personality: {character.character.personality}
                                </h2>
                                <h5 className="text-2xl">
                                    Hobbies : {character.character.hobbies} <br />
                                    Quirks : {character.character.quirks} <br />
                                    Equipment : {character.character.equipment} <br />
                                    Powers : {character.character.powers} <br />
                                    Body Modifications : {character.character.bodyModifications}
                                </h5>
                                <p className="py-6">
                                    {character.character.backstory}
                                </p>
                                <button className="btn btn-primary">Get Started</button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default CharacterPopModal;

