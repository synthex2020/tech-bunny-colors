import { supabase } from "./SupabaseClientPeristence";
import { CharacterProfile } from "../types";


// Upload a single CharacterProfile as a JSON file and return its public URL
export const uploadJsonFileToSupabase = async (
  profile: CharacterProfile
): Promise<string | null> => {
  try {
    // Create a readable file name based on the character's name
    const baseName =
      profile.identity?.name?.trim() || "character-profile";

    const safeName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const uniqueFileName = `${Date.now().toFixed(
      0
    )}-${safeName || "character"}.json`;

    // Turn the profile into JSON text
    const jsonString = JSON.stringify(profile, null, 2);

    // Create a Blob (works in browsers; in Node you might use Buffer instead)
    const jsonBlob = new Blob([jsonString], {
      type: "application/json",
    });

    // Upload to Supabase storage
    // NOTE: change 'json-bucket' and 'profiles/' to whatever bucket/folder you prefer
    const { data, error } = await supabase.storage
      .from("json-bucket")
      .upload(`profiles/${uniqueFileName}`, jsonBlob, {
        contentType: "application/json",
        upsert: false,
      });

    if (error) {
      console.error("JSON upload error:", error);
      return null;
    }

    // Option 1: use getPublicUrl (recommended)
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("json-bucket")
      .getPublicUrl(data.path);

    return publicUrl;

    // Option 2 (if you prefer the hard-coded prefix style like your image upload):
    //
    // const stringPath =
    //   "https://mkcijqngeshomivhjrbe.supabase.co/storage/v1/object/public/json-bucket/";
    // return stringPath + data.path;
  } catch (err) {
    console.error("Unexpected error uploading JSON:", err);
    return null;
  }
};

  //      upload file to supabase 
  export const uploadImageFilesToSupabase = async (imageFiles : any) => {
    let resultImages : string[] = [];

    for (const file of imageFiles) {
        const uniqueFileName = `${Date.now().toFixed(2)}-${file.name}`;

        const { data, error } = await supabase
            .storage
            .from('image-bucket')
            .upload(`uploads/${uniqueFileName}`, file);

        if (error) {
            console.error("Upload error:", error);
        } else {
            console.log("Uploaded:", data);
            const stringPath = 'https://mkcijqngeshomivhjrbe.supabase.co/storage/v1/object/public/image-bucket/';
            const result = stringPath + "" + data.path;
            resultImages.push(result);
        }
    }

    return resultImages;
};

export const uploadVideosToSupabase = async (videoFiles : any) => {
    // Upload videos
    for (const file of videoFiles) {
        const uniqueFileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase
            .storage
            .from('video-bucket')
            .upload(`upload/${uniqueFileName}`, file);

        if (error) {
            console.error("Video upload error:", error);
        } else {
            const stringPath = 'https://mkcijqngeshomivhjrbe.supabase.co/storage/v1/object/public/video-bucket/';
            const result = stringPath + "" + data.path;
            return result
        }// end if-else 
    } // end for loop 
};