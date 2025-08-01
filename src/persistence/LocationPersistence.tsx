import { SeriesLocation, SeriesLocationMedia } from "../types";
import { uploadImageFilesToSupabase } from "./MediaPersistence";
import { supabase } from "./SupabaseClientPeristence";

interface LocationDatabaseProps {
    seriesId : string;
    seriesLocation : SeriesLocation;
    imageFiles : File[];
}

export async function add_new_location(locationProps : LocationDatabaseProps) {
    //  ADD MEDIA TO RELEVENT DATABASE STORAGE 
    const resultantImages = await uploadImageFilesToSupabase(locationProps.imageFiles);
    const seriesLocation = locationProps.seriesLocation;
    //  ADD LOCATION TO SUPABASE 
    const {error} = await supabase.rpc('req_add_new_location', {

        location_title : seriesLocation.title,
        location_type : seriesLocation.type,
        location_geo_location : seriesLocation.geoLocation,
        location_description : seriesLocation.description,
        location_series_id : locationProps.seriesId,
        location_media : resultantImages.toString(),
        location_media_type : "Images"
    });

    if (error) {
        console.log("Failed to add location", error);
        return false;
    }

    return true;
}

export async function update_location_media(seriesLocationMedia : SeriesLocationMedia)  {
    const {error} = await supabase.rpc('req_update_location_media', {
       
        parent_id : seriesLocationMedia.id,
        location_media : seriesLocationMedia.media,
        media_type : seriesLocationMedia.type
    })

    if (error) {
        console.log("There was an error updating series location media", error)
        return false;
    }
    
    return true;
}

