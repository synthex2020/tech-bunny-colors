import { useState } from "react";
import { useLocation } from "react-router";
import { uploadImageFilesToSupabase, uploadVideosToSupabase } from "../../../persistence/MediaPersistence";
import { addContentItem } from "../../../persistence/ContentBankPerisistence";
import { runContentGeneration } from "../../../persistence/ContentBankPerisistence";

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
    const [previewUrls, setPreviewUrls] = useState({
        thumbnail: null as string | null,
        media: null as string | null,
    });

    const [generatedThumbnail, setGeneratedThumbnail] = useState<File | null>(null);
    const [generatedVideo, setGeneratedVideo] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [uploading, setUploading] = useState(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.title.trim()) newErrors.title = "Title is required.";
        if (!form.category.trim()) newErrors.category = "Category is required.";
        if (!form.thumbnail) newErrors.thumbnail = "Thumbnail file is required.";
        if (!form.media) newErrors.media = "Media file is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setUploading(true);
        try {
            const query = {
                transcript: "Preview voiceover from user transcript, this is our first attempt and we are excited", // You can enhance this
                platform: "instagram",
                template: "instagram-update",
                video: form.media!,
            };

            const result = await runContentGeneration(query);
            setGeneratedThumbnail(result.thumbnail_file);
            setGeneratedVideo(result.video_file);
            setShowPreview(true);
        } catch (err) {
            console.error("Error generating content preview", err);
            alert("Failed to generate video content.");
        } finally {
            setUploading(false);
        }
    };

    const confirmUpload = async () => {
        if (!generatedThumbnail || !generatedVideo) return alert("Missing preview files");

        try {
            setUploading(true);
            const thumbnailUrl = await uploadImageFilesToSupabase([generatedThumbnail]);
            const videoUrl = await uploadVideosToSupabase([generatedVideo]);

            const payload = {
                project_id: projectId,
                content_title: form.title,
                content_category: form.category,
                content_thumbnail: thumbnailUrl!,
                content_media: videoUrl!,
            };

            await addContentItem(payload);
            alert("Content successfully uploaded and added.");
            setShowPreview(false); // reset
        } catch (error) {
            console.error("Final upload failed", error);
            alert("Upload failed: " + error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-100 shadow-lg rounded-xl mt-10">
            <h2 className="text-2xl font-bold mb-4">Upload New Content</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Form inputs same as before... */}
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
                {/* Your existing input fields go here */}
                {/* ... */}

                <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
                    {uploading ? "Processing..." : "Generate Preview"}
                </button>
            </form>

            {showPreview && (
                <div className="mt-8 p-4 border rounded-lg bg-base-200">
                    <h3 className="text-xl font-semibold mb-2">Preview Generated Content</h3>
                    {generatedThumbnail && (
                        <img
                            src={URL.createObjectURL(generatedThumbnail)}
                            alt="Generated Thumbnail"
                            className="w-full max-h-64 object-contain rounded-lg shadow-md mb-4"
                        />
                    )}
                    {generatedVideo && (
                        <video
                            src={URL.createObjectURL(generatedVideo)}
                            controls
                            className="w-full max-h-64 object-contain rounded-lg shadow-md"
                        />
                    )}
                    <button
                        className="btn btn-success w-full mt-4"
                        onClick={confirmUpload}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Confirm & Upload"}
                    </button>
                </div>
            )}
        </div>
    );
}
