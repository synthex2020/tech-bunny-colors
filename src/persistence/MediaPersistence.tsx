import { supabase } from "./SupabaseClientPeristence";


  //      upload file to supabase 
  export const uploadImageFilesToSupabase = async (imageFiles : any) => {

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
            return result;
        }
    }
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