import { Series } from "../types";
import { uploadImageFilesToSupabase } from "./MediaPersistence";
import { supabase } from "./SupabaseClientPeristence";

interface AddSeriesProps {
    series : Omit<Series, 'id' | 'createdAt'>;
    imageFiles : File[];
}
//  ADD SERIES 
export async function add_series(seriesProps: AddSeriesProps): Promise<boolean> {
    const series = seriesProps.series;
    const imageFiles = seriesProps.imageFiles;

    //  ADD IMAGES AND VIDEOS TO DATABASE 
    const imageResult = await uploadImageFilesToSupabase(imageFiles);

    const { error } = await supabase.rpc('req_add_series', {
        series_title: series.title,
        series_authors: series.authors,
        series_artists: series.artists,
        series_genre: series.genre ?? 'All',
        series_thumbnail: imageResult[0],
        series_description: series.description,
        series_plot: series.plot,
        series_auidence: series.audience,
        series_history: series.history,
        series_physics: series.physics,
        series_world: series.world,
        series_issues: series.issues,
        series_volumes: series.volumes,
        series_merchandise: series.merchandise,
        series_published: series.published,
        series_status: series.status,
        series_power_system: series.powerSystem,
    });

    if (error) {
        console.error('Error adding series:', error);
        return false;
    }

    return true;
}
//  UPDATE SERIES 
export async function update_series(series: Series): Promise<boolean> {
    const { error } = await supabase.rpc('req_update_series', {
        parent_series_id: series.id,
        series_title: series.title,
        series_authors: series.authors,
        series_artists: series.artists,
        series_genre: series.genre,
        series_thumbnail: series.thumbnail,
        series_description: series.description,
        series_plot: series.plot,
        series_auidence: series.audience,
        series_history: series.history,
        series_physics: series.physics,
        series_world: series.world,
        series_issues: series.issues,
        series_volumes: series.volumes,
        series_merchandise: series.merchandise,
        series_published: series.published,
        series_status: series.status,
        series_power_system: series.powerSystem
    });

    if (error) {
        console.error('Error updating series:', error);
        return false;
    }

    return true;
}

//  FETCH SERIES 
export async function fetch_available_series(): Promise<Series[]> {
    const { data, error } = await supabase.rpc('req_get_available_series');
    
    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    if (!data) return [];

    const fix_json_structure = (json_string: string) => {
        return JSON.parse(json_string);
    };



    const result = data.map((project: any): Series => ({
        id: project.id,
        createdAt: project.created_at,
        title: project.title,
        authors: project.authors,
        artists: project.artists,
        genre: project.genre,
        thumbnail: project.thumbnail,
        description: project.description,
        plot: project.plot,
        audience: project.audience,
        history: project.history,
        physics: project.physics,
        world: project.world,
        issues: project.issues,
        volumes: project.volumes,
        merchandise: project.merchandise,
        published: project.published,
        status: project.status,
        powerSystem: project.power_system,
        characters: fix_json_structure(project.characters) ?? [],
        locations: project.locations ?? [],
        timeline: project.events ?? [],
        media: project.media ?? []
    }));


    return result;
}

//  FETCH SERIES CHARACTERS 