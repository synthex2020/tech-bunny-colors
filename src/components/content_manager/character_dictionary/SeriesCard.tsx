import { useNavigate } from "react-router";
import SeriesMoreDetailsModal from "./SeriesMoreDetailModal";

interface Locations {
    title: string;
    type: string;
    geoLocation: string;
    description: string;
    images: string[];
}

interface ImportantEvents {
    title: string;
    date: string;
    importance: string;
    description: string;
    images: string[];
}

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

//  style, 
interface Series {

    title: string;
    authors: string;
    artists: string;
    genre: string;
    age: string;
    thumbnail: string;
    description: string;
    plot: string;
    auidence: string;
    history: string;
    physics: string;
    world: string;
    issues: number;
    volumes: number;
    merchandised: boolean;
    published: boolean;
    currentStatus: string;
    powerSystem: string[];
    images: string[];
    timeline: ImportantEvents[];
    locations: Locations[];
    characters: Character[];
}

interface SeriesCardProps {
    series: Series;
    index: number;
}
//  SELECT CHARACTERS BY SERIES 


function SeriesCard(series : SeriesCardProps) {
    const navigate = useNavigate();
    return (
        <div className="card card-compact bg-base-100 w-96 shadow-xl">
            <figure>
                {/** THUMBNAIL  */}
                <img
                    src={series.series.thumbnail}
                    alt={series.series.title + "" + "Thumbnail"} />
            </figure>
            <div className="card-body">
                {/** TITLE - author, artists, genre, published, status */}
                <h2 className="card-title">{series.series.title}</h2>
                <h3>Published : {series.series.published.toString()}</h3>
                <h4>Status: {series.series.currentStatus}</h4>
                <p>
                    Authors: {series.series.authors} <br/> 
                    Artists : {series.series.artists} <br />
                    Auidence : {series.series.auidence}
                </p>
                {/** VIEW SERIES DETAILS  */}
                <div className="flex flex-row justify-start">
                    <SeriesMoreDetailsModal 
                        series={series.series}
                        modalId={series.index.toString()}
                    />
                </div>
                <div className="card-actions justify-end">
                    {/** ACCESS TO TABLES - LOCATION, CHARACTERS, EVENTS  */}
                    <button 
                        className="btn btn-ghost"
                        onClick={() => navigate('/characterDir/locationsTable', {
                            state : series.series.locations
                        })}
                        >
                            Locations
                    </button>
                    <button 
                        className="btn btn-ghost"
                        onClick={() => navigate('/characterDir/charactersTable', {
                            state : series.series.characters
                        })}
                    >
                        Characters
                    </button>
                    <button 
                        className="btn btn-ghost"
                        onClick={() => navigate('/characterDir/importantEvents', {
                            state : series.series.timeline
                        })}
                    >
                        Events
                    </button>


                </div>
            </div>
        </div>
    );
} // end series card 

export default SeriesCard;
