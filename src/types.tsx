
export type Series = {
    id : string;
    createdAt : string;
    title : string;
    authors : string;
    artists : string;
    genre : string;
    thumbnail : string;
    description : string;
    plot : string;
    audience : string;
    history : string;
    physics : string;
    world : string;
    issues : number;
    volumes : number;
    merchandise : boolean;
    published : boolean;
    status : string;
    powerSystem : string;
    characters : [];
    locations : [];
    timeline : [];
    media : [];
};

export type SeriesMedia = {
    id : string;
    created_at : string;
    media : string;
    type : string;
    series_id : string;

};

export type Character = {
    id : string;
    createdAt : string;
    titles : string;
    name : string;
    sex : string;
    gender : string;
    species : string;
    personality : string;
    hair : string;
    fashion : string;
    quirks : string;
    relationships : string;
    orientation : string;
    race : string;
    age : string;
    powers : string;
    martialArts : string;
    hobbies : string;
    equipment : string;
    backstory : string;
    references : string;
    characterSheet : string;
    bodyMods : string;
    anatomy : string;
    model : string;
    family : string[];
    referenceMedia : string[];
    media : string[];
};

export type SeriesEvent = {
    id : string;
    createdAt : string;
    title : string;
    date : string;
    importance : string;
    description : string;
    eventsMedia : string[];
};

export type SeriesLocation = {
    id : string;
    createdAt : string;
    title : string;
    type : string;
    geoLocation : string;
    description : string;
    locationMedia : string[];
};

export type Family = {
    id : string;
    familyName : string;
    patron : string;
    history : string;
};

export type Relation = {
    characterId : string;
    familyId : string;
};

export type FamilyRelations = {};