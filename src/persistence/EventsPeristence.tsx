import { SeriesEvent, SeriesEventMedia } from "../types";
import { uploadImageFilesToSupabase } from "./MediaPersistence";
import { supabase } from "./SupabaseClientPeristence";

interface EventsPersistenceProps {
    seriesEvent : SeriesEvent,
    seriesId : string;
    imageFiles : File[] | undefined ;
};

export async function add_series_event (eventProps: EventsPersistenceProps) : Promise<boolean> {
    
    const seriesEvent = eventProps.seriesEvent;
    const seriesId = eventProps.seriesId;
    const eventsMedia = eventProps.imageFiles;

    //  UPLOAD IMAGES AND VIDEOS TO STORAGE FIRST 
    const resultantImages = await uploadImageFilesToSupabase(eventsMedia);

    //  UPLOAD TO DATABASE WITH BOOLEAN RETURN 
    const {error} = await supabase.rpc('req_add_new_event', {

        event_title : seriesEvent.title,
        event_date : seriesEvent.date,
        event_importance : seriesEvent.importance,
        event_description : seriesEvent.description,
        event_media : resultantImages.toString(),
        series_id : seriesId
    });

    if (error) {
        console.log('Error adding event to series: ', error );
        return false;
    }

    return true;
}

export async function update_series_event(eventProps : EventsPersistenceProps) {
    const {error} = await supabase.rpc('req_update_event', {

        parent_id : eventProps.seriesEvent.id,
        event_title : eventProps.seriesEvent.title,
        event_date : eventProps.seriesEvent.date,
        event_importance : eventProps.seriesEvent.importance,
        event_description : eventProps.seriesEvent.description
    });

    if (error) {
        console.log("Failed to update event ", eventProps.seriesEvent);
        return false;
    }

    return true;
}

export async function update_event_media(eventMedia : SeriesEventMedia) {
    const {error} = await supabase.rpc('req_update_event_media', {
        parent_id : eventMedia.id,
        event_media : eventMedia.media,
        parent_event_id : eventMedia.eventId
    });

    if (error) {
        console.log('Failed to update event media : ', eventMedia);
        return false;
    }

    return true;
}