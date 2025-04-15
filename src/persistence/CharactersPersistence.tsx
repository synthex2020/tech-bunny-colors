import { supabase } from "./SupabaseClientPeristence";

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
    anatomyMeasurements: string;
}


//  FETCH CHARACTER BY ID 


