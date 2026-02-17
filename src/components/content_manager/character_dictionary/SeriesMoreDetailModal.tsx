//  SHOW MORE DETAILS ON SERIES  - INCLUDE IN-WORLD LOCATIONS AND EVENTS OF IMPORTANCE
import { useState } from "react";
import { Series } from "../../../types";

interface SeriesProps {
    series: Series;
    modalId: string;
}


function SeriesMoreDetailsModal(seriesProps: SeriesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const MediaCarousel = () => {
        //const imagesRaw = seriesProps.series.media;
        //const images: SeriesMedia[] = Array.isArray(imagesRaw) ? imagesRaw : [''];
        const images : string[]= [seriesProps.series.thumbnail];
    
    
        const prevSlide = () => {
            setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        };
    
        const nextSlide = () => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        };
    
        if (images.length === 0) return <div>No media found</div>;
    
        return (
            <div className="carousel w-1/2 relative">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className={`carousel-item absolute w-1/2 transition-opacity duration-700 ${
                            index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <img src={src} alt={`Slide ${index + 1}`} />
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
            <button
                className="btn btn-ghost btn-sm flex flex-col items-center"
                onClick={() => (document.getElementById(seriesProps.modalId) as HTMLDialogElement)?.showModal()}
            >
                View Series
            </button>
            <dialog id={seriesProps.modalId} className="modal">
                <div className="modal-box w-11/12 max-w-5xl">

                    <div className="hero min-h-screen">
                        <div className="hero-content flex-col lg:flex-row">
                            {/** MEDIA ITEMS - Images  */}
                            <img src={seriesProps.series.thumbnail}/>
                            
                            {/** TEXT DESCRIPTORS + HYPER LINKS   */}
                            <div>
                                <h1 className="text-5xl font-bold">{seriesProps.series.title}</h1>
                                <h2 className="text-lg font-semibold">Authors : {seriesProps.series.authors}</h2>
                                <h2 className="text-lg font-semibold">Artists : {seriesProps.series.artists}</h2>
                                <h4 className="text-sm">{seriesProps.series.genre}</h4>
                                <h5 className="text-sm">{seriesProps.series.powerSystem.toString()}</h5>
                                <p className="py-6 overflow-clip">
                                    Made : {seriesProps.series.createdAt}  | {seriesProps.series.audience} <br/>
                                    {seriesProps.series.issues} Issues | {seriesProps.series.volumes} Volumes <br/>
                                    Was merchandised : {seriesProps.series.merchandise.toString()}<br/>
                                    Published : {seriesProps.series.published.toString()}<br/>
                                    Status : {seriesProps.series.status} <br/>
                                    {seriesProps.series.plot}
                                </p>

                                <div className="flex flex-row gap-2">
                                    <a 
                                        target="_blank" 
                                        href=""
                                    >
                                        Important Events
                                    </a>
                                    <a 
                                        target="_blank" 
                                        href=""
                                        >
                                            Locations
                                        </a>
                                    <a 
                                        target="_blank" 
                                        href=""
                                        >
                                            Characters
                                    </a>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/** TEXT AREA DESCRIPTORS */}
                    <div>
                        <h3>History</h3>
                        <p className="text text-wrap text-sm">{seriesProps.series.history}</p>
                        <h3>Physics</h3>
                        <p className="text text-wrap text-sm">{seriesProps.series.physics}</p>
                        <h3>World</h3>
                        <p className="text text-wrap text-sm">{seriesProps.series.world}</p>
                        <h3>Description</h3>
                        <p className="text text-wrap text-sm">{seriesProps.series.description}</p>

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


export default SeriesMoreDetailsModal;