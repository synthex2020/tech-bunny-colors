
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
    media : [string];
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
    character_sheet : string;
    bodyMods : string;
    anatomy : string;
    model : string;
    family : string[];
    referenceMedia : string[];
    media : string[];

};

export type CharacterProfile = {
    identity : {
        name : string;
        nickname : string;
        //  [DROPDOWN OPTIONS] - Man, Woman, Trans-Woman, Trans-Man, Non-Binary, Other
        gender: string;
        family : string;
        education : string;
        address : string;
        languages : string[];
        career : string[];
        pets : string[];
        plants : string[];
        religion : string;
        favouriteColor : string;
        favouriteFood : string;
        favouriteObject : string;
        luckyNumber : number;
        fears : string[];
        supernatural : {
            fightStyle : string;
            //  [DROPDOWN OPTIONS] - Artificer, Babarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Socerer, Warlock, Wizard
            class : string;
            strengths : string[];
            weaknesses : string[];
            primaryElement : string;
            secondaryElement : string;
            tertiaryElement : string;
        };
    },
    anatomy : {
        age: number;
        // [DROPDOWN OPTIONS] - Male, Female, Intersex
        sex : string;
        race : string;
        species: string;
        bodyType : string;
        bloodType : string;
        height : string;
        weight : string;
        eyesight : string;
        colorBlind : string;
        //  [DROPDOWN OPTIONS ] - True, False
        glasses : boolean;
        //  [DROPDOWN OPTIONS] - Right, Left, Ambidextrous
        handed : string;
        voice_type: string;
        scars : string[];
        burns : string[];
        skinDamage : string[];
        tattoos : string[];
        birthmarks : string[];
        nose : string;
        eyes : string;
        posture : string;
        //  [DROPDOWN OPTIONS] - Male, Adoscolent, US - Bra Sizes 
        breast : string;
        legs : string;
        moles : string[];

    },
    personality : {
        sayings : string;
        hobbies : string;
        habits : string[];
        personality : string;
        insecurities : string[];
    },
    bio : {
        dob: string;
        dod : string;
        birthplace : string;
        surgeries : string[];
        cavities : string[];
        sexualHistory : string[];
        currentLovers : string[];
        pastLovers : string[];
        //  [DROPDOWN OPTIONS] - Single, Dating, Situationship, Engaged, Married, Seperated, Divorced, Widowed
        relationshipStatus : string;
        problemRelationships : string;
        familyRelationships : string;
        friends : string[];
        rivals : string[];
        admires : string[];
        hates : string[];
        philosphyLove : string;
        phiolosphyRelationships : string;
        childhood : string;
        criminalRecord : string[];
        fears : string[];
        successes : string[];
        failures : string[];
        dreams : string[];
    },
    other : {
        inspiration : string;
        referenceImage : string | null; 
    }
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

