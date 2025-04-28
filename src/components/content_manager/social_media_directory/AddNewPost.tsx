import { useLocation } from "react-router";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { supabase } from "../../../persistence/SupabaseClientPeristence";
import { send_post_for_generation } from "../../../persistence/GenerationPerisistence";
import { ClipLoader } from "react-spinners";
import { fetchContentBank, ContentItem } from "../../../persistence/ContentBankPerisistence";

interface GenerationPostRequest {
    title: string;
    caption: string;
    hashtags: string;
    platform: string;
}

function AddNewSocialMediaPost() {
    const defaultThumbnail = 'https://mkcijqngeshomivhjrbe.supabase.co/storage/v1/object/public/image-bucket/uploads/1744670450501.00-bannerError.png';

    const [contentThumbnail, setContentThumbnail] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);
    const [videos, setVideos] = useState<string[]>([]);
    const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
    const [contentItems, setContentItems] = useState<ContentItem[]>([]);
    const [mediaType, setMediaType] = useState(true);
    const [isLoadingPrecheck, setIsLoadingPrecheck] = useState(false);
    const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [chosenMediaSite, setChosenMediaSite] = useState("");
    const [formDataCurrent, setFormDataCurrent] = useState({
        title: '',
        caption: '',
        hashtags: '',
        social: '',
        auidence: '',
        releaseDate: '',
        isAd: true,
        adBudget: ''
    });

    const [formData, setFormData] = useState<GenerationPostRequest>({
        title: '',
        caption: '',
        hashtags: '',
        platform: ''
    });

    const [precheckResult, setPrecheckResult] = useState<any>(null);
    const ref = useRef<LoadingBarRef>(null);


    const handleMediaFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const files = Array.from(event.target.files);
        const imageFilesList: File[] = [];
        const videoFilesList: File[] = [];
        const imagePreviews: string[] = [];
        const videoPreviews: string[] = [];

        files.forEach((file) => {
            const mime = file.type;

            if (mime.startsWith("image/")) {
                imageFilesList.push(file);
                imagePreviews.push(URL.createObjectURL(file));
                setMediaType(true);
            } else if (mime.startsWith("video/")) {
                videoFilesList.push(file);
                videoPreviews.push(URL.createObjectURL(file));
                setMediaType(false);
            } else {
                console.warn("Unsupported file type:", mime);
            }
        });

        setImageFiles(prev => [...prev, ...imageFilesList]);
        setVideoFiles(prev => [...prev, ...videoFilesList]);
        setImages(prev => [...prev, ...imagePreviews]);
        setVideos(prev => [...prev, ...videoPreviews]);
    };

    //      upload file to supabase 
    const uploadImageFilesToSupabase = async () => {

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
                setUploadedImages(prev => [...prev, result]);
                console.log(uploadedImages)
            }
        }
    };

    const uploadVideosToSupabase = async () => {
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
                setUploadedVideos((prev) => [...prev, result]);
            }// end if-else 
        } // end for loop 
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formElements = e.currentTarget.elements as typeof e.currentTarget.elements & {
            title: HTMLInputElement;
            caption: HTMLTextAreaElement;
            hashtags: HTMLInputElement;
            social: HTMLInputElement;
            audience: HTMLInputElement;
            releaseDate: HTMLInputElement;
            isAd: HTMLInputElement;
            adBudget: HTMLInputElement;

        };

        const currentFormData = {

            title: formElements.title.value,
            caption: formElements.caption.value,
            hashtags: formElements.hashtags.value,
            social: chosenMediaSite || formElements.social.value,
            auidence: formElements.audience.value,
            releaseDate: formElements.releaseDate.value,
            isAd: formElements.isAd.value === 'true' ? true : false,
            adBudget: formElements.adBudget.value
        };

        setFormDataCurrent(currentFormData);

        const newFormData: GenerationPostRequest = {
            title: formElements.title.value,
            caption: formElements.caption.value,
            hashtags: formElements.hashtags.value,
            platform: chosenMediaSite || formElements.social.value
        };

        setFormData(newFormData);
        ref.current?.continuousStart();
        //  Upload images 
        if (mediaType != true) {
            await uploadVideosToSupabase();
            //console.log("video upload triggered");
        } else {
            await uploadImageFilesToSupabase();
            //console.log("image upload triggered");
        } // end if-else 
        

        // Trigger the precheck after setting formData
        alert('Generating Preview , please wait, it might take up to 2 mins. You will be informed when the preview is complete');
        setIsLoadingPrecheck(true)
        await handleGenerationRequest(newFormData);
        ref.current?.complete();
    };

    const handleConfirmation = async (projectId: string) => {

        try {
            const { data, error } = await supabase.rpc('req_add_new_project_post', {
                p_projectid: projectId,
                p_type: chosenMediaSite,
                p_title: formDataCurrent.title,
                p_thumbnail: uploadedImages[0] ?? ( (contentThumbnail ?? uploadedVideos[0]) ?? defaultThumbnail),
                p_media: uploadedVideos[0] ?? '',
                p_caption: precheckResult ?? precheckResult.status.split("#")[0],
                p_hashtags: formDataCurrent.hashtags,
                p_mentions: '',
                p_adcost: formDataCurrent.adBudget,
                p_adrun:  formDataCurrent.adBudget != ''
            });
            console.log(error);
            alert('Sumbmission is succesful at : ' + data.post_created_at + '')
        } catch (error) {
            console.log(error)
            alert('An error occured, failed to upload request' + error + '')
        }
    }

    const handleGenerationRequest = async (data: GenerationPostRequest) => {
        try {
            const generationResponse = await send_post_for_generation(data);
            setPrecheckResult({
                date: generationResponse.date,
                status: generationResponse.status,
                timestamp: generationResponse.timestamp
            });

            console.log("Precheck successful:", generationResponse);
            alert('Preview Generation Successful')
            setIsLoadingPrecheck(false)
            // Optionally, show modal here for user to confirm before final submission

        } catch (error) {
            console.error("Precheck failed:", error);
            alert('Preview generation failed : ' + error + '')
            setIsLoadingPrecheck(false)
        }
    };

    const checkMediaType = () => {
        if (mediaType) {
            return (
                <>
                    {images.map((image, index) => (
                        <div
                            id={`slide${index + 1}`}
                            key={index}
                            className="carousel-item relative w-full"
                        >
                            <img
                                src={image}
                                className="w-full object-contain"
                                alt={`Slide ${index + 1}`}
                            />
                            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                <a
                                    href={`#slide${index === 0 ? images.length : index}`}
                                    className="btn btn-circle"
                                >
                                    ❮
                                </a>
                                <a
                                    href={`#slide${index === images.length - 1 ? 1 : index + 2}`}
                                    className="btn btn-circle"
                                >
                                    ❯
                                </a>
                            </div>
                        </div>
                    ))}
                </>
            );
        } else {
            return (
                <>
                    {videos.map((image, index) => (
                        <div
                            id={`slide${index + 1}`}
                            key={index}
                            className="carousel-item relative w-full"
                        >
                            <video
                                src={image}
                                controls
                                className="w-full object-contain"
                            />
                            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                <a
                                    href={`#slide${index === 0 ? videos.length : index}`}
                                    className="btn btn-circle"
                                >
                                    ❮
                                </a>
                                <a
                                    href={`#slide${index === videos.length - 1 ? 1 : index + 2}`}
                                    className="btn btn-circle"
                                >
                                    ❯
                                </a>
                            </div>
                        </div>
                    ))}
                </>
            );
        }// end if else 
    };
    const location = useLocation();
    const projectName = location.state?.title || "";
    const projectId = location.state?.projectId || '';

    return (
        <div className="p-10">
            <LoadingBar color="#f11946" ref={ref} shadow={true}/>
            <div className="flex flex-col lg:flex-row gap-4">
                {/* MEDIA ENTRY */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl font-bold">Add Post for Project : {projectName}</h1>

                    {/* MEDIA CAROUSEL */}
                    <div className="carousel w-full">
                        {checkMediaType()}
                    </div>

                    {/* FILE UPLOAD BUTTONS */}
                    <div className="flex flex-row gap-4 justify-center mt-4">
                        {/* Upload Images */}
                        <div>
                            <label htmlFor="image-upload" className="btn btn-primary">
                                Upload Images
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleMediaFileUpload}
                                data-type="image"
                                hidden
                                multiple
                            />
                        </div>

                        {/* Upload Videos */}
                        <div>
                            <label htmlFor="video-upload" className="btn btn-secondary">
                                Upload Videos
                            </label>
                            <input
                                id="video-upload"
                                type="file"
                                accept="video/*"
                                onChange={handleMediaFileUpload}
                                data-type="video"
                                hidden
                                multiple
                            />
                        </div>

                        {/** Choose from content bank  */}
                        <div>
                            <button className="btn btn-accent" onClick={async () => {
                                const items = await fetchContentBank();
                                setContentItems(items);
                                setIsLibraryModalOpen(true);
                                (document.getElementById('content_modal') as HTMLDialogElement).showModal();
                                console.log(items);
                            }}>
                                Content Bank
                            </button>
                        </div>

                    </div>
                </div>

                <dialog className="modal" id="content_modal">
                    <div>
                        <div className="modal-box w-full">
                            <h3 className="font-bold text-lg">Select Content</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                {contentItems.map((item, index) => (
                                    <div key={index} className="cursor-pointer border-white border-solid" onClick={() => {
                                        setVideos(prev => [...prev, item.media]);
                                        setUploadedVideos(prev => [...prev, item.media]);
                                        setContentThumbnail(item.thumbnail);
                                        setMediaType(false);
                                        setIsLibraryModalOpen(false);
                                    }}>
                                        <video src={item.media} controls className="rounded shadow w-full h-48 object-cover" onClick={(e) => e.stopPropagation()} />
                                        <p>{item.title} -- {item.category}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </dialog>



                {/* FORM */}
                <div className="flex flex-col justify-center lg:flex-none">
                    <form className="form" onSubmit={handleSubmit}>
                        <fieldset className="fieldset space-y-2">
                            <label className="fieldset-label text-3xl font-bold">Post Title</label><br />
                            <input type="text" className="input input-bordered text-sm w-full" placeholder="Post Title" id="title" /><br />

                            <label className="fieldset-label text-2xl font-bold">Post Hashtags</label><br />
                            <input type="text" className="input input-bordered w-full text-xs" placeholder="" id="hashtags" /><br />

                            <label className="fieldset-label text-2xl font-bold">Post Target Audience</label><br />
                            <input type="text" className="input input-bordered w-full text-sm" placeholder="Scifi watchers, young adult" id="audience" /><br />

                            <div className="flex flex-row justify-center gap-4 space-x-6">
                                <div>
                                    <label className="fieldset-label text-lg font-semibold">Post Scheduled Release</label><br />
                                    <input type="date" className="input input-bordered text-sm" id="releaseDate" /><br />
                                </div>
                                <div>
                                    <label className="fieldset-label text-lg font-semibold">Will the post be advertised?</label><br />
                                    <div className="flex flex-row flex-wrap gap-2">
                                        <input type="checkbox" className="checkbox checkbox-primary" id="isAd" />
                                        <input type="text" className="input input-bordered text-sm" placeholder="CAD $40.00" id="adBudget" />
                                    </div>
                                </div>
                                <div>
                                    <label className="fieldset-label text-lg font-semibold">Post Social Media Platform</label><br />
                                    <div className="flex flex-row flex-wrap">
                                        <input type="text" className="input input-bordered text-sm font-extrabold" placeholder={chosenMediaSite} id="social" disabled /><br />
                                        <div className="dropdown dropdown-bottom">
                                            <div tabIndex={0} role="button" className="btn m-1">Platform ⬇️</div>
                                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                                {["facebook", "tiktok", "medium", "linkedIn", "youtube", "instagram"].map(platform => (
                                                    <li key={platform}>
                                                        <a onClick={() => setChosenMediaSite(platform)}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <label className="fieldset-label text-2xl font-bold">Post Caption</label><br />
                            <textarea className="textarea textarea-bordered textarea-lg text-sm w-full" placeholder="Your Caption" id="caption" /><br />

                            <button className="btn btn-neutral mt-4" type="submit">Submit</button>
                        </fieldset>
                    </form>
                </div>
            </div>

            {/* Optional: Display precheck response */}
            {precheckResult && (
                <div className="mt-6 p-4 bg-base-200 rounded">
                    <h2 className="text-2xl font-semibold">Precheck Summary</h2>

                    {isLoadingPrecheck ? (
                        // Loading Spinner
                        <div className="flex justify-center items-center h-32">
                            <ClipLoader
                                color="#ffffff"
                                loading={isLoadingPrecheck}
                            />
                            =                        </div>
                    ) : (
                        <>
                            <br />
                            <h3 className="text-xl font-bold pb-2">
                                Note: You can also resubmit using the form above, if you wish to edit
                                what you submitted
                            </h3>

                            {/* Uploaded Media Display */}
                            <div className="mb-4">
                                <h4 className="text-lg font-semibold">Uploaded Files:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                    {uploadedImages.map((src, index) => (
                                        <img
                                            key={`img-${index}`}
                                            src={src}
                                            alt={`Uploaded ${index}`}
                                            className="rounded shadow w-full h-48 object-cover"
                                        />
                                    ))}

                                    {uploadedVideos.map((src, index) => (
                                        <video
                                            key={`vid-${index}`}
                                            src={src}
                                            controls
                                            className="rounded shadow w-full h-48 object-cover"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Summary Text */}
                            <pre className="whitespace-pre-wrap mb-4">
                                {"Date:\n" +
                                    precheckResult.date +
                                    "\n\nResponse:\n" +
                                    precheckResult.status +
                                    "\n\nTimestamp:\n" +
                                    precheckResult.timestamp}
                            </pre>

                            {/* Action Buttons */}
                            <div className="flex flex-row gap-4">
                                <button className="btn btn-neutral mt-4" onClick={() => handleConfirmation(projectId)}>
                                    Confirm Submission
                                </button>
                                <button
                                    className="btn btn-neutral mt-4"
                                    onClick={() => handleGenerationRequest(formData)}
                                >
                                    Re-Submit
                                </button>
                            </div>
                        </>
                    )}
                </div>

            )}
        </div>
    );
}

export default AddNewSocialMediaPost;
