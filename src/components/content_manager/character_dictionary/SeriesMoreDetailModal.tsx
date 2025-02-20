//  SHOW MORE DETAILS ON SERIES  - INCLUDE IN-WORLD LOCATIONS AND EVENTS OF IMPORTANCE

interface Locations {}

interface ImportantEvents {}

interface Character {}

//  style, 
interface Series {

    title : string;
    authors : string;
    artists : string;
    genre: string;
    age: string;
    thumbnail : string;
    description: string;
    plot : string;
    auidence : string;
    history : string;
    physics : string;
    world: string;
    issues : number;
    volumes : number;
    merchandised: boolean;
    published : boolean;
    currentStatus : string;
    images : string[];
    timeline : ImportantEvents[];
    locations : Locations[];    
    characters : Character[];
}

function SeriesMoreDetailsModal () {
    return (
        <div>
            <h1>Series Details</h1>
        </div>
    );
} 

export default SeriesMoreDetailsModal;