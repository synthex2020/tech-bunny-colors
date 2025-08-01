import { supabase } from "./SupabaseClientPeristence"

export interface ContentItem {
  id: string;
  created_at: string;
  project_id: string;
  category: string;
  thumbnail: string;
  media: string;
  title: string;
};

export interface ContentRequest {
  project_id: string;
  content_title: string;
  content_category: string;
  content_thumbnail: string;
  content_media: string;
};

export interface ContentQuery {
  transcript: string;
  platform: string;
  template: string;
  video: any;
};

export interface ContentGenerated {
  date: string;
  status: string;
  thumbnail_file: any;
  timestamp: string;
  type: string;
  video_file: any;
};

const queryUrl = 'http://caleido-hope-ai.byfcbwdcazc9caey.eastus.azurecontainer.io:8080';
export async function deleteContentItem(contentId: string) {
  const { data, error } = await supabase.rpc('req_delete_content', {
    content_id: contentId
  });

  if (error) {
    console.error('Error fetching projects:', error);
  } else {
    console.log(data);
  }
};

export async function addContentItem(contentRequest: ContentRequest) {

  const { data, error } = await supabase.rpc('req_add_content', {
    project_id: contentRequest.project_id,
    content_title: contentRequest.content_title,
    content_category: contentRequest.content_category,
    content_thumbnail: contentRequest.content_thumbnail,
    content_media: contentRequest.content_media
  });

  if (error) {
    console.error('Error fetching projects:', error);
  } else {
    console.log(data);
  }
}

export async function fetchContentBank(): Promise<ContentItem[]> {

  const { data, error } = await supabase.rpc('req_fetch_content');

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  if (!data) return [];

  return data.map((content: any): ContentItem => ({
    id: content.id,
    created_at: content.created_at,
    project_id: content.projectid,
    category: content.category,
    thumbnail: content.thumbnail,
    media: content.media,
    title: content.title
  }));
}

export async function runContentGeneration(query: ContentQuery): Promise<ContentGenerated> {
  const formData = new FormData();
  formData.append("video", query.video);
  formData.append("transcript", query.transcript);
  formData.append("platform", query.platform);
  formData.append("template", query.template);

  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }  // Step 1: Send POST request
  const postResponse = await fetch(`${queryUrl}/predict/content-generation`, {
    method: "POST",
    body: formData,
  });

  if (!postResponse.ok) {
    throw new Error("Failed to generate content.");
  }

  const {
    video_url,
    thumbnail_url,
    date,
    status,
    timestamp,
    type,
    video_filename,
    thumbnail_filename
  } = await postResponse.json();

  // Step 2: Download video file
  const videoRes = await fetch(`${queryUrl}${video_url}`);
  if (!videoRes.ok) throw new Error("Failed to download video.");
  const videoBlob = await videoRes.blob();
  const videoFile = new File([videoBlob], video_filename || "video.mp4", {
    type: "video/mp4",
  });

  // Step 3: Download thumbnail file
  const thumbRes = await fetch(`${queryUrl}${thumbnail_url}`);
  if (!thumbRes.ok) throw new Error("Failed to download thumbnail.");
  const thumbBlob = await thumbRes.blob();
  const thumbnailFile = new File([thumbBlob], thumbnail_filename || "thumbnail.png", {
    type: "image/png",
  });

  return {
    date,
    status,
    timestamp,
    type,
    video_file: videoFile,
    thumbnail_file: thumbnailFile,
  };
}
