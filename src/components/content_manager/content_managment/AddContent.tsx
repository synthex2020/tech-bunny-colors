import { useState, useRef } from "react";
import { useLocation } from "react-router";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { uploadImageFilesToSupabase, uploadVideosToSupabase } from "../../../persistence/MediaPersistence";
import { addContentItem } from "../../../persistence/ContentBankPerisistence";
import { runContentGeneration } from "../../../persistence/ContentBankPerisistence";

interface ContentForm {
    title: string;
    category: string;
    template: string;
    platform: string;
    transcript: string;
    thumbnail: File | null;
    media: File | null;
}

export default function UploadContentPage() {
    const location = useLocation();
    const projectId = location.state?.projectId ?? "";

    const ref = useRef<LoadingBarRef>(null);

    const [form, setForm] = useState<ContentForm>({
        title: "",
        category: "",
        template: "",
        platform: "",
        transcript: "",
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
        if (!form.media) newErrors.media = "Media file is required.";
        if (!form.template) newErrors.template = "A template must be selected";
        if (!form.transcript) newErrors.transcript = "A transcript is needed for the video";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        ref.current?.continuousStart();
        try {
            const query = {
                transcript: form.transcript!,
                platform: form.platform!,
                template: form.template!,
                video: form.media!,
            };

            const result = await runContentGeneration(query);
            setGeneratedThumbnail(result.thumbnail_file);
            setGeneratedVideo(result.video_file);
            setShowPreview(true);
            ref.current?.complete();

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
            <LoadingBar color="#f11946" ref={ref} shadow={true} />
            <h2 className="text-2xl font-bold mb-4">Upload New Content</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Title */}
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

                {/* Category */}
                <div>
                    <label className="label">Category</label>
                    <select name="category" value={form.category} onChange={handleChange} className="select select-bordered w-full">
                        <option value="">Select Category</option>
                        <option value="Video">Video</option>
                        <option value="Image">Image</option>
                        <option value="3D-file">3D File</option>
                        <option value="Sound-Clip">Sound Clip</option>
                    </select>

                    {errors.category && <p className="text-error text-sm">{errors.category}</p>}

                </div>

                {/* Platform */}

                <div>
                    <label className="label">Platform</label>
                    <select name="platform" value={form.platform} onChange={handleChange} className="select select-bordered w-full">
                        <option value="">Select Platform</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Youtube">Youtube</option>
                        <option value="Tiktok">TikTok</option>
                        <option value="Medium">Medium</option>
                        <option value="LinkedIn">LinkedIn</option>
                    </select>

                    {errors.platform && <p className="text-error text-sm">{errors.platform}</p>}
                </div>

                {/* Template Dropdown */}
                <div>
                    <label className="label">Template</label>
                    <select name="template" value={form.template} onChange={handleChange} className="select select-bordered w-full">
                        <option value="">Select Template</option>
                        <option value="instagram-update">Instagram – Update</option>
                        <option value="instagram-announcement">Instagram – Announcement</option>
                        <option value="instagram-introduction">Instagram – Introduction</option>
                        <option value="instagram-bvc-chapter">Instagram – BVC Chapter</option>
                        <option value="instagram-bvc-announcement">Instagram – BVC Announcement</option>

                        <option value="tiktok-update">TikTok – Update</option>
                        <option value="tiktok-announcement">TikTok – Announcement</option>
                        <option value="tiktok-introduction">TikTok – Introduction</option>
                        <option value="tiktok-bvc-chapter">TikTok – BVC Chapter</option>
                        <option value="tiktok-bvc-announcement">TikTok – BVC Announcement</option>

                        <option value="youtube-update">YouTube – Update</option>
                        <option value="youtube-announcement">YouTube – Announcement</option>
                        <option value="youtube-introduction">YouTube – Introduction</option>
                        <option value="youtube-bvc-chapter">YouTube – BVC Chapter</option>
                        <option value="youtube-bvc-announcement">YouTube – BVC Announcement</option>

                        <option value="linkedin-update">LinkedIn – Update</option>
                        <option value="linkedin-announcement">LinkedIn – Announcement</option>
                        <option value="linkedin-introduction">LinkedIn – Introduction</option>
                        <option value="linkedin-bvc-chapter">LinkedIn – BVC Chapter</option>
                        <option value="linkedin-bvc-announcement">LinkedIn – BVC Announcement</option>

                        <option value="twitter-update">Twitter – Update</option>
                        <option value="twitter-announcement">Twitter – Announcement</option>
                        <option value="twitter-introduction">Twitter – Introduction</option>
                        <option value="twitter-bvc-chapter">Twitter – BVC Chapter</option>
                        <option value="twitter-bvc-announcement">Twitter – BVC Announcement</option>

                        <option value="facebook-update">Facebook – Update</option>
                        <option value="facebook-announcement">Facebook – Announcement</option>
                        <option value="facebook-introduction">Facebook – Introduction</option>
                        <option value="facebook-bvc-chapter">Facebook – BVC Chapter</option>
                        <option value="facebook-bvc-announcement">Facebook – BVC Announcement</option>
                    </select>

                    {errors.template && <p className="text-error text-sm">{errors.template}</p>}
                </div>

                {/* Transcript Textarea */}
                <div>
                    <label className="label">Transcript</label>
                    <textarea
                        name="transcript"
                        value={form.transcript}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full min-h-[160px]"
                        placeholder="Enter full transcript or narration text here..."
                    />
                    {errors.transcript && <p className="text-error text-sm">{errors.transcript}</p>}
                </div>



                {/* Media Upload */}
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
                    {errors.media && <p className="text-error text-sm">{errors.media}</p>}
                </div>

                {/* Submit Button */}
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
