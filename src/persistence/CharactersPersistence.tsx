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
    // run fetch for anatomy
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
        family: (() => {
            try {
                const parsed = JSON.parse(char.family || '[]');
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        })(),

       
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
        //reference_images: updated.reference_images,
        family: [], // Not returned in this RPC
        referenceMedia: [], // Not returned in this RPC
        media: [] // Not returned in this RPC
    };
}

//  ADD CHARACTER MEDIA

//  UPDATE CHARACTER MEDIA

//  ADD NEW CHARACTER - ADD TO RELATIONS TABLE AS WELL IN QUERY ON SUPABASE 
interface AddCharacterProps {
    character: Omit<Character, 'id'>;
    seriesId: string;
}

export async function add_new_character(char_props: AddCharacterProps): Promise<Boolean> {
    try {
        const character = char_props.character;
        const [familyId] = character.family;


        const { data, error } = await supabase.rpc('req_add_character_with_family', {
            character_titles: character.titles,
            character_sex: character.sex,
            character_gender: character.gender,
            character_species: character.species,
            character_personality: character.personality,
            character_hair: character.hair,
            character_fashion: character.fashion,
            character_quirks: character.quirks,
            character_relationships: character.relationships,
            character_orientation: character.orientation,
            character_race: character.race,
            character_age: character.age,
            character_powers: character.powers,
            character_martial_arts: character.martialArts,
            character_hobbies: character.hobbies,
            character_equipment: character.equipment,
            character_backstory: character.backstory,
            character_references: character.references,
            character_character_sheet: character.character_sheet,
            character_body_mods: character.bodyMods,
            character_anatomy: JSON.stringify(character.anatomy),
            character_model: "n/a",
            character_name: character.name,
            character_media_file: "https://mkcijqngeshomivhjrbe.supabase.co/storage/v1/object/public/image-bucket/defaults/avatar-2.jpg",
            character_media_context: "default_image",
            character_family_id: familyId,
            parent_series_id: char_props.seriesId
        });

        if (error) {
            console.error('[ERROR] :: add_new_character', error);
            return false;
        }

        if (data?.startsWith('Error')) {
            console.error('[SUPABASE FUNCTION ERROR]', data);
            return false;
        }

        return true;
    } catch (error) {
        console.log("[ERROR] :: add_new_character", error)
        return false;
    }// end try-catch 
} // end function 


