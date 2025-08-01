import { useState } from "react";

export const MediaCarousel = ({ images }: { images: string[] }) => {

    console.log(images)

    const [currentIndex, setCurrentIndex] = useState(0);


    if (images.length === 0) return null;

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="carousel relative">

            {images.map((src, index) => (
                <div
                    key={index}
                    className={`carousel-item  w-full transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                >
                    
                    <img src={src} className="w-full object-contain" alt={`Slide ${index + 1}`} />
                </div>
            ))}

            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <button onClick={prevSlide} className="btn btn-circle">Prev</button>
                <button onClick={nextSlide} className="btn btn-circle">Next</button>
            </div>
        </div>
    );
};