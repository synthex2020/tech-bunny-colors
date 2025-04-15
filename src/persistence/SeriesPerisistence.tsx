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


//  ADD SERIES 

//  UPDATE SERIES 

//  FETCH SERIES 

//  FETCH SERIES CHARACTERS 