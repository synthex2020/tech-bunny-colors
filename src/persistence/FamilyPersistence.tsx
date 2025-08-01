import { Family, Relation } from "../types";
import { supabase } from "./SupabaseClientPeristence";



//  ADD NEW FAMILY TO SERIES 
export async function add_new_family(family: Omit<Family, 'id'>): Promise<Boolean> {
    try {
        const { error } = await supabase.rpc('req_add_family', {
            char_family_name: family.familyName,
            char_family_patron: family.patron,
            char_family_history: family.history
        });

        if (error) {
            console.error('[ERROR] :: An error occured in add_new_family', error);
            return false;
        }

        return true;
    } catch (error) {
        console.log("[ERROR] :: An error occured in add_new_family", error)
        return false;
    }// end try-catch 
} // end add_new_family


//  ADD NEW FAMILY MEMBER TO EXISTING FAMILY

export async function add_new_family_member(relation: Relation): Promise<Boolean> {
    try {
        const { error } = await supabase.rpc('req_insert_relation', {
            parent_character_id : relation.characterId,
            parent_family_id : relation.familyId
        });

        if (error) {
            console.error('[ERROR] :: An error occured in add_new_family_member', error);
            return false;
        }

        return true;
    } catch (error) {
        console.log("[ERROR] :: An error occured in add_new_family_member", error)
        return false;
    }// end try-catch 
}; // end add_new_family_member

//  REMOVE FAMILY MEMBER 

