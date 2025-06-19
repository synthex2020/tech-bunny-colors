import { supabase } from "./SupabaseClientPeristence";
import { Character } from "../types";
import { uploadImageFilesToSupabase } from "./MediaPersistence";

interface CharacterProps {
    character: Character;
    referenceImages: File[];
    characterSheet: File;
    seriesId: string;

}
//  FETCH SERIES CHARACTERS 
export async function fetch_series_characters(seriesId: string): Promise<Character[]> {
    const { data, error } = await supabase.rpc('req_get_series_characters', {
        parent_series_id: seriesId,
    });

    if (error) {
        console.error('Error fetching characters:', error);
        return [];
    }

    if (!data) return [];

    return data.map((char: any): Character => ({
        id: char.id,
        createdAt: char.created_at,
        titles: char.titles,
        name: char.name,
        sex: char.sex,
        gender: char.gender,
        species: char.species,
        personality: char.personality,
        hair: char.hair,
        fashion: char.fashion,
        quirks: char.quirks,
        relationships: char.relationships,
        orientation: char.orientation,
        race: char.race,
        age: char.age,
        powers: char.powers,
        martialArts: char.martial_arts,
        hobbies: char.hobbies,
        equipment: char.equipment,
        backstory: char.backstory,
        references: char.character_references,
        character_sheet: char.character_sheet,
        bodyMods: char.body_mods,
        anatomy: char.anatomy,
        model: char.model,
        reference_images: char.reference_images,
        family: JSON.parse(char.family || '{}'),
        referenceMedia: JSON.parse(char.reference_images || '[]'),
        media: char.media || [],
    }));
}

export async function update_character(character: Character): Promise<Character | null> {
    const { data, error } = await supabase.rpc('req_update_character', {
        character_id: character.id,
        char_titles: character.titles,
        chars_sex: character.sex,
        chars_gender: character.gender,
        char_species: character.species,
        char_personality: character.personality,
        char_hair: character.hair,
        char_fashion: character.fashion,
        char_quirks: character.quirks,
        char_relationships: character.relationships,
        char_orientation: character.orientation,
        char_race: character.race,
        char_age: character.age,
        char_powers: character.powers,
        char_martial_arts: character.martialArts,
        char_hobbies: character.hobbies,
        char_equipment: character.equipment,
        char_backstory: character.backstory,
        char_references: character.references,
        char_character_sheet: character.character_sheet,
        char_body_mods: character.bodyMods,
        char_anatomy: character.anatomy,
        char_model: character.model,
        char_name: character.name
    });

    if (error) {
        console.error('Error updating character:', error);
        return null;
    }

    if (!data || !data[0]) return null;

    const updated = data[0];

    return {
        id: updated.id,
        createdAt: updated.created_at,
        titles: updated.titles,
        name: updated.name,
        sex: updated.sex,
        gender: updated.gender,
        species: updated.species,
        personality: updated.personality,
        hair: updated.hair,
        fashion: updated.fashion,
        quirks: updated.quirks,
        relationships: updated.relationships,
        orientation: updated.orientation,
        race: updated.race,
        age: updated.age,
        powers: updated.powers,
        martialArts: updated.martial_arts,
        hobbies: updated.hobbies,
        equipment: updated.equipment,
        backstory: updated.backstory,
        references: updated.character_references,
        character_sheet: updated.character_sheet,
        bodyMods: updated.body_mods,
        anatomy: updated.anatomy,
        model: updated.model,
        reference_images: updated.reference_images,
        family: [], // Not returned in this RPC
        referenceMedia: [], // Not returned in this RPC
        media: [] // Not returned in this RPC
    };
}

//  ADD NEW CHARACTER
export async function add_new_character(characterProps: CharacterProps) {
    //  ADD CHARACTER SHEET TO BACKEND 
    const characterSheetResult = await uploadImageFilesToSupabase([characterProps.characterSheet]);
    const characterSheet = characterSheetResult[0];

    //  ADD REFERENCE MEDIA TO BACKEND 
    const referenceImageResults = await uploadImageFilesToSupabase(characterProps.referenceImages);

    //  ADD DEFAULT CHARACTER MEDIA (CHARACTER SHEET IMAGE )

    //  ADD CHARACTER TO BACKEND 
    const { data, error } = await supabase.rpc('req_add_new_character', {
        char_titles: characterProps.character.titles,
        chars_sex: characterProps.character.sex,
        chars_gender: characterProps.character.gender,
        char_species: characterProps.character.species,
        char_personality: characterProps.character.personality,
        char_hair: characterProps.character.hair,
        char_fashion: characterProps.character.fashion,
        char_quirks: characterProps.character.quirks,
        char_relationships: characterProps.character.relationships,
        char_orientation: characterProps.character.orientation,
        char_race: characterProps.character.race,
        char_age: characterProps.character.age,
        char_powers: characterProps.character.powers,
        char_martial_arts: characterProps.character.martialArts,
        char_hobbies: characterProps.character.hobbies,
        char_equipment: characterProps.character.equipment,
        char_backstory: characterProps.character.backstory,
        char_references: characterProps.character.references,
        char_character_sheet: characterSheet,
        char_body_mods: characterProps.character.bodyMods,
        char_anatomy: characterProps.character.anatomy,
        char_model: characterProps.character.model,
        char_name: characterProps.character.name,
        char_media_file: characterSheet,
        char_media_context: referenceImageResults.toString(),
        parent_series_id: characterProps.seriesId
    });

    if (error) {
        console.error('Error adding character:', error);
        return false;
    }

    if (!data) return false;

    return true;
}

//  FETCH CHARACTERS FOR EDITING 

//  EDIT CHARACTER MEDIA 

//  UPDATE CHARACTER 
export async function edit_character(character: Character) {

    const { data, error } = await supabase.rpc('req_update_character', {
        character_id : character.id,
        char_titles : character.titles,
        chars_sex : character.sex,
        chars_gender : character.gender,
        char_species : character.species,
        char_personality : character.personality,
        char_hair : character.hair,
        char_fashion : character.fashion,
        char_quirks : character.quirks,
        char_relationships : character.relationships,
        char_orientation : character.orientation,
        char_race : character.race,
        char_age : character.age,
        char_powers : character.powers,
        char_martial_arts : character.martialArts,
        char_hobbies : character.hobbies,
        char_equipment : character.equipment,
        char_backstory : character.backstory,
        char_references : character.references,
        char_character_sheet : character.character_sheet,
        char_body_mods : character.bodyMods,
        char_anatomy : character.anatomy,
        char_model : character.model,
        char_name : character.name
    });

    if (error) {
        console.error('Error fetching characters:', error);
        return false;
    }

    if (!data) return false;

    return true
}

//  ADD CHARACTER TO FAMILY 

