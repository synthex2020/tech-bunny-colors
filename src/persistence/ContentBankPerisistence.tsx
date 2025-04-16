import { supabase } from "./SupabaseClientPeristence"

export interface ContentItem {
    id : string;
    created_at: string;
    project_id : string;
    category : string;
    thumbnail : string;
    media : string;
    title : string;
};

export interface ContentRequest {
    project_id : string;
    content_title : string;
    content_category : string;
    content_thumbnail : string;
    content_media : string;
};

export async function deleteContentItem(contentId : string) {
    const { data, error } = await supabase.rpc('req_delete_content', {
        content_id : contentId
    });

      if (error) {
        console.error('Error fetching projects:', error);
      }else{
        console.log(data);
      }
};

export async function addContentItem (contentRequest : ContentRequest) {

    const { data, error } = await supabase.rpc('req_add_content', {
        project_id : contentRequest.project_id,
        content_title : contentRequest.content_title,
        content_category : contentRequest.content_category,
        content_thumbnail : contentRequest.content_thumbnail,
        content_media : contentRequest.content_media
    });

      if (error) {
        console.error('Error fetching projects:', error);
      }else{
        console.log(data);
      }
}

export async function fetchContentBank () : Promise<ContentItem[]> {
    
    const { data, error } = await supabase.rpc('req_fetch_content');
    
      if (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
    
      if (!data) return [];
    
      return data.map((content: any): ContentItem => ({
        id : content.id,
        created_at : content.created_at,
        project_id : content.projectid,
        category : content.category,
        thumbnail : content.thumbnail,
        media : content.media,
        title : content.title
      }));
}