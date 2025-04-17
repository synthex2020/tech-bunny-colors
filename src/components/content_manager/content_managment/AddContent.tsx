import { useState } from "react";
import { useLocation } from "react-router";
import { uploadImageFilesToSupabase, uploadVideosToSupabase } from "../../../persistence/MediaPersistence";
import { addContentItem } from "../../../persistence/ContentBankPerisistence";

//  WHEN WE ADD THE CONTENT FILE - ADD TRANSCRIPT AND  TYPE FIELD ( ANNOUCEMENT, UPDATE, INTRODUCTION ) and 
//  SEND TO SERVER FOR AI VIDEO RENDERING PROCESSING AND EDITING (ADD TEXT TO SPEECH , ADD THUMBNAIL )
//  USE LOCAL IF POSSIBLE OR GOOGLE COLLAB WITH A NOTEBOOK (ON SERVER)

//  ADD TO FORM - TRANSCRIPT + TYPE , ADD OPTION TO CHOOSE EXISTING TEMPLATE TO IMAGES 


interface ContentForm {
    title: string;
    category: string;
    thumbnail: File | null;
    media: File | null;
}

export default function UploadContentPage() {
    const location = useLocation();
    const projectId = location.state?.projectId ?? "";

    const [form, setForm] = useState<ContentForm>({
        title: "",
        category: "",
        thumbnail: null,
        media: null,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [previewUrls, setPreviewUrls] = useState<{
        thumbnail: string | null;
        media: string | null;
    }>({
        thumbnail: null,
        media: null,
    });

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.title.trim()) newErrors.title = "Title is required.";
        if (!form.category.trim()) newErrors.category = "Category is required.";
        if (!form.thumbnail) newErrors.thumbnail = "Thumbnail file is required.";
        if (!form.media) newErrors.media = "Media file is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, files } = e.target as any;

        if (files) {
            const file = files[0];
            setForm({ ...form, [name]: file });

            const url = URL.createObjectURL(file);
            setPreviewUrls({ ...previewUrls, [name]: url });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const uploadToSupabase = async (file: File): Promise<string> => {
        // Empty stub – you will implement actual upload logic here
        const files = [file];
        const result = await uploadImageFilesToSupabase(files);
        console.log(result);
        return result + '';
    };

    const uploadVideoToSupabase = async (file: File): Promise<string> => {
        const files = [file];
        const result = await uploadVideosToSupabase(files);
        console.log(result);
        return result + '';
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const thumbnailUrl = await uploadToSupabase(form.thumbnail!);
        const mediaUrl = await uploadVideoToSupabase(form.media!);

        const payload = {
            project_id: projectId,
            content_title: form.title,
            content_category: form.category,
            content_thumbnail: thumbnailUrl,
            content_media: mediaUrl,
        };

        try {
            await addContentItem(payload)
            alert('Content Added to the Database');
        } catch (error) {
            console.log(error)
            alert('An error occured, failed to upload request' + error + '')
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-100 shadow-lg rounded-xl mt-10">
            <h2 className="text-2xl font-bold mb-4">Upload New Content</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="label">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    {errors.title && <p className="text-error text-sm">{errors.title}</p>}
                </div>

                <div>
                    <label className="label">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    {errors.category && (
                        <p className="text-error text-sm">{errors.category}</p>
                    )}
                </div>

                {/* Thumbnail Preview + Input */}
                <div>
                    <label className="label">Thumbnail</label>
                    {previewUrls.thumbnail && (
                        <img
                            src={previewUrls.thumbnail}
                            alt="Thumbnail Preview"
                            className="rounded-lg shadow-md w-full max-h-64 object-contain mb-2"
                        />
                    )}
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleChange}
                        className="file-input file-input-bordered w-full"
                    />
                    {errors.thumbnail && (
                        <p className="text-error text-sm">{errors.thumbnail}</p>
                    )}
                </div>

                {/* Media Preview + Input */}
                <div>
                    <label className="label">Media</label>
                    {previewUrls.media && (
                        <div className="mb-2">
                            {form.media?.type.startsWith("video") ? (
                                <video
                                    controls
                                    src={previewUrls.media}
                                    className="rounded-lg shadow-md w-full max-h-64 object-contain"
                                />
                            ) : (
                                <img
                                    src={previewUrls.media}
                                    alt="Media Preview"
                                    className="rounded-lg shadow-md w-full max-h-64 object-contain"
                                />
                            )}
                        </div>
                    )}
                    <input
                        type="file"
                        name="media"
                        accept="video/*,image/*"
                        onChange={handleChange}
                        className="file-input file-input-bordered w-full"
                    />
                    {errors.media && (
                        <p className="text-error text-sm">{errors.media}</p>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-full">
                    Upload
                </button>
            </form>
        </div>
    );
}
