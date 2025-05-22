import { supabase } from "./SupabaseClientPeristence"

export interface Posts {
  title: string;
  thumbnail: string;
  media: string;
  caption: string;
  hashtags: string;
  mentions: string;
  adCost: string;
  adRun: boolean;
}

export interface Project {
  id: string;
  title: string;
  media: string;
  caption: string;
  hashtags: string;
  tags: string; // maps from `techstack`
  targetAudience: string; // maps from `audience`
  adRun: boolean;
  budget: string;
  facebook: Posts[];
  instagram: Posts[];
  twitter: Posts[];
  youtube: Posts[];
  tiktok: Posts[];
  linkedIn: Posts[];
  medium: Posts[];
}

export async function fetch_projects(): Promise<Project[]> {
  const { data, error } = await supabase.rpc('req_fetch_projects');

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  if (!data) return [];

  return data.map((project: any): Project => ({
    id: project.id,
    title: project.title,
    media: project.media,
    caption: project.caption,
    hashtags: project.hashtags,
    tags: project.techstack,
    targetAudience: project.audience,
    adRun: project.adrun,
    budget: project.budget,
    facebook: project.facebook ?? [],
    instagram: project.instagram ?? [],
    twitter: project.twitter ?? [],
    youtube: project.youtube ?? [],
    tiktok: project.tiktok ?? [],
    linkedIn: project.linkedIn ?? [],
    medium: project.medium ?? []
  }));
}




